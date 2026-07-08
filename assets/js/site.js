(function () {
  const GOOGLE_SCRIPT_URL = "PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";

  function initMobileNav() {
    const header = document.querySelector("[data-mobile-nav]");
    if (!header) return;
    const button = header.querySelector(".mobile-menu-toggle");
    const menu = header.querySelector("#mobile-menu");
    if (!button || !menu) return;
    button.addEventListener("click", () => {
      const isOpen = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!isOpen));
      button.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
      menu.hidden = isOpen;
      menu.classList.toggle("is-open", !isOpen);
    });
    menu.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-label", "Open navigation menu");
        menu.hidden = true;
        menu.classList.remove("is-open");
      }
    });
  }

  function initForms() {
    document.querySelectorAll("[data-lead-form]").forEach((form) => {
      const status = form.querySelector(".form-status");
      const button = form.querySelector("button[type='submit']");
      const originalText = button ? button.textContent : "";
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!form.checkValidity()) {
          form.reportValidity();
          if (status) {
            status.textContent = "Please complete the required fields.";
            status.classList.add("error");
          }
          return;
        }
        const data = Object.fromEntries(new FormData(form).entries());
        const payload = {
          leadType: form.dataset.formType || "Website Inquiry",
          websitePage: window.location.href,
          submittedAt: new Date().toISOString(),
          ...data
        };
        if (button) {
          button.disabled = true;
          button.textContent = "Sending...";
        }
        if (status) {
          status.textContent = "";
          status.classList.remove("error");
        }
        try {
          if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes("PASTE_GOOGLE_APPS_SCRIPT")) {
            await new Promise((resolve) => setTimeout(resolve, 450));
            form.reset();
            if (status) status.textContent = "Thanks. This local preview is working. Add the Google Apps Script Web App URL to send submissions to the sheet.";
            return;
          }
          const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(payload)
          });
          if (!response.ok) throw new Error("Submission failed");
          form.reset();
          if (status) status.textContent = "Thank you. Your message has been sent.";
        } catch (error) {
          if (status) {
            status.textContent = "Something went wrong. Please call Rahwa directly at (206) 489-8822.";
            status.classList.add("error");
          }
        } finally {
          if (button) {
            button.disabled = false;
            button.textContent = originalText;
          }
        }
      });
    });
  }

  function initLightbox() {
    const images = document.querySelectorAll(".gallery-item img, .photo-mosaic img");
    if (!images.length) return;
    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.hidden = true;
    lightbox.innerHTML = '<button class="lightbox-close" type="button" aria-label="Close image preview">&times;</button><img alt="">';
    document.body.appendChild(lightbox);
    const lightboxImg = lightbox.querySelector("img");
    const close = lightbox.querySelector("button");
    function open(img) {
      lightboxImg.src = img.currentSrc || img.src;
      lightboxImg.alt = img.alt || "Expanded Rahwa Elderly Care photo";
      lightbox.hidden = false;
      close.focus();
    }
    function hide() {
      lightbox.hidden = true;
      lightboxImg.removeAttribute("src");
    }
    images.forEach((img) => {
      const trigger = img.closest("button") || img;
      trigger.addEventListener("click", () => open(img));
    });
    close.addEventListener("click", hide);
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) hide();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") hide();
    });
  }

  initMobileNav();
  initForms();
  initLightbox();
})();
