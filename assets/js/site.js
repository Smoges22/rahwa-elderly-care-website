(function () {
  var lightbox = null;
  var lightboxImage = null;
  var closeButton = null;
  var previousFocus = null;
  var emptyImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E";

  function getLargeImageUrl(image) {
    var source = image.currentSrc || image.src;
    if (!source) {
      return "";
    }
    return source.replace(/-(480|960|1440)(\.jpe?g)$/i, "$2");
  }

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) {
      return;
    }
    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
    lightboxImage.src = emptyImage;
    lightboxImage.removeAttribute("alt");
    if (previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus();
    }
  }

  function openLightbox(image) {
    if (!lightbox || !lightboxImage) {
      return;
    }
    previousFocus = document.activeElement;
    lightboxImage.src = getLargeImageUrl(image);
    lightboxImage.alt = image.alt || "Expanded home photo";
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    closeButton.focus();
  }

  function buildLightbox() {
    lightbox = document.createElement("div");
    lightbox.className = "image-lightbox";
    lightbox.hidden = true;
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Expanded image preview");
    lightbox.innerHTML = '<button class="image-lightbox-close" type="button" aria-label="Close expanded image">&times;</button><div class="image-lightbox-frame"><img alt=""></div>';
    document.body.appendChild(lightbox);
    closeButton = lightbox.querySelector(".image-lightbox-close");
    lightboxImage = lightbox.querySelector("img");
    lightboxImage.src = emptyImage;

    closeButton.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeLightbox();
      }
    });
  }

  function enhanceImages() {
    var images = document.querySelectorAll("main picture img");
    images.forEach(function (image) {
      image.classList.add("js-lightbox-image");
      image.setAttribute("tabindex", "0");
      image.setAttribute("role", "button");
      image.setAttribute("aria-label", "Open image fullscreen: " + (image.alt || "home photo"));
      image.addEventListener("click", function () {
        openLightbox(image);
      });
      image.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openLightbox(image);
        }
      });
    });
  }

  function enhanceFormspreeForms() {
    var forms = document.querySelectorAll("[data-formspree-form]");
    forms.forEach(function (form) {
      form.addEventListener("submit", function (event) {
        if (!window.fetch) {
          return;
        }
        event.preventDefault();
        var data = new FormData(form);
        var status = form.querySelector(".form-status");
        var submitButton = form.querySelector("[type='submit']");
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.textContent = "Sending...";
        }
        fetch(form.action, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" }
        }).then(function (response) {
          if (!response.ok) {
            throw new Error("Form submission failed");
          }
          form.reset();
          if (status) {
            status.hidden = false;
          }
        }).catch(function () {
          HTMLFormElement.prototype.submit.call(form);
        }).finally(function () {
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = submitButton.dataset.originalText || "Send Message";
          }
        });
      });
      var submitButton = form.querySelector("[type='submit']");
      if (submitButton) {
        submitButton.dataset.originalText = submitButton.textContent;
      }
    });
  }

  function enhanceMobileNavigation() {
    var headers = document.querySelectorAll("[data-mobile-nav]");
    headers.forEach(function (header) {
      var button = header.querySelector(".mobile-menu-toggle");
      var menu = header.querySelector(".premium-mobile-menu");
      var closeTimer;
      if (!button || !menu) {
        return;
      }
      menu.setAttribute("aria-hidden", "true");

      function setOpen(isOpen) {
        window.clearTimeout(closeTimer);
        button.setAttribute("aria-expanded", isOpen ? "true" : "false");
        button.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
        menu.setAttribute("aria-hidden", isOpen ? "false" : "true");
        if (isOpen) {
          menu.hidden = false;
          requestAnimationFrame(function () {
            menu.classList.add("is-open");
          });
        } else {
          menu.classList.remove("is-open");
          closeTimer = window.setTimeout(function () {
            if (button.getAttribute("aria-expanded") !== "true") {
              menu.hidden = true;
            }
          }, 220);
        }
      }

      button.addEventListener("click", function (event) {
        event.stopPropagation();
        setOpen(button.getAttribute("aria-expanded") !== "true");
      });

      menu.addEventListener("click", function (event) {
        if (event.target.closest("a")) {
          setOpen(false);
        }
      });

      document.addEventListener("pointerdown", function (event) {
        if (!header.contains(event.target)) {
          setOpen(false);
        }
      });

      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && button.getAttribute("aria-expanded") === "true") {
          setOpen(false);
          button.focus();
        }
      });
    });
  }

  function enhanceScrollReveal() {
    var targets = document.querySelectorAll("main section, .care-overview-card, .service-detail-card, .tour-command-card, .decision-checklist article, .quick-contact-card, .service-card, .clinical-card, .care-cta-band, .conversion-band");
    if (!targets.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    targets.forEach(function (target) {
      target.classList.add("reveal-on-scroll");
    });
    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (target) {
        target.classList.add("is-visible");
      });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    targets.forEach(function (target) {
      observer.observe(target);
    });
  }

  function init() {
    buildLightbox();
    enhanceImages();
    enhanceFormspreeForms();
    enhanceMobileNavigation();
    enhanceScrollReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
