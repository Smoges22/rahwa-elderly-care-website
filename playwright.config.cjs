module.exports = {
  testDir: "./tests",
  reporter: "list",
  use: {
    baseURL: process.env.QA_BASE_URL || "http://127.0.0.1:4173",
    viewport: { width: 390, height: 844 },
  },
};
