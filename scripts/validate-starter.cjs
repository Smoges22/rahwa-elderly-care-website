const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const htmlFiles = [];
const missing = [];
const requiredSnippets = {
  mobileNavigation: "mobile-menu-toggle",
  contactForm: "leadType\" value=\"Website Contact",
  tourForm: "leadType\" value=\"Schedule Tour",
  lightboxTargets: "<picture>",
  socialPreview: "assets/social/social-preview.svg",
};

function walk(directory) {
  for (const name of fs.readdirSync(directory)) {
    if (name === ".git") continue;
    const filePath = path.join(directory, name);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walk(filePath);
    } else if (filePath.endsWith(".html")) {
      htmlFiles.push(filePath);
    }
  }
}

function isExternalOrToken(url) {
  return (
    url.startsWith("{{") ||
    url.startsWith("http") ||
    url.startsWith("tel:") ||
    url.startsWith("mailto:") ||
    url.startsWith("#")
  );
}

function localTargetExists(file, url) {
  let cleanUrl = url.split("?")[0];
  if (cleanUrl.endsWith("/")) cleanUrl += "index.html";
  const target = path.resolve(path.dirname(file), cleanUrl);
  return fs.existsSync(target);
}

walk(root);

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const attributePattern = /(?:src|href|action)=["']([^"']+)["']/g;
  let match;

  while ((match = attributePattern.exec(html))) {
    const url = match[1];
    if (!isExternalOrToken(url) && !localTargetExists(file, url)) {
      missing.push(`${path.relative(root, file)} -> ${url}`);
    }
  }
}

const allHtml = htmlFiles.map((file) => fs.readFileSync(file, "utf8")).join("\n");
const missingFeatures = Object.entries(requiredSnippets)
  .filter(([, snippet]) => !allHtml.includes(snippet))
  .map(([name]) => name);

if (missing.length || missingFeatures.length) {
  if (missing.length) {
    console.error("Broken local paths:");
    missing.forEach((item) => console.error(`- ${item}`));
  }
  if (missingFeatures.length) {
    console.error("Missing required features:");
    missingFeatures.forEach((item) => console.error(`- ${item}`));
  }
  process.exit(1);
}

console.log(`Validated ${htmlFiles.length} HTML pages.`);
console.log("No broken local paths.");
console.log("Required starter-kit features are present.");
