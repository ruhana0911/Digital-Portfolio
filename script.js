document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector(".menu-button");
  const nav = document.querySelector(".nav-links");
  const themeButton = document.querySelector(".theme-button");
  const navLinks = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll("main section[id]");
  const revealElements = document.querySelectorAll(".reveal");
  const yearElement = document.querySelector("#year");

  // Show the current year in the footer
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Add a border to the navigation bar after scrolling
  function updateHeader() {
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 24);
    }
  }

  window.addEventListener("scroll", updateHeader);
  updateHeader();

  // Open and close the mobile navigation menu
  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const menuIsOpen = nav.classList.toggle("open");

      menuButton.setAttribute(
        "aria-expanded",
        menuIsOpen.toString()
      );

      menuButton.setAttribute(
        "aria-label",
        menuIsOpen ? "Close navigation" : "Open navigation"
      );
    });
  }

  // Close the mobile menu when a navigation link is selected
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (nav) {
        nav.classList.remove("open");
      }

      if (menuButton) {
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute(
          "aria-label",
          "Open navigation"
        );
      }
    });
  });

  // Reveal page content as the user scrolls
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    // Display everything if the browser does not support IntersectionObserver
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  // Highlight the navigation link for the current section
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const currentSection = `#${entry.target.id}`;

          navLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === currentSection
            );
          });
        });
      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  // Load the previously selected colour theme
  let savedTheme = null;

  try {
    savedTheme = localStorage.getItem("portfolio-theme");
  } catch (error) {
    console.log("Theme preference could not be loaded.");
  }

  if (savedTheme === "light") {
    document.body.classList.add("light");
  }

  // Update the light/dark mode icon
  function updateThemeIcon() {
    if (!themeButton) {
      return;
    }

    const themeIcon = themeButton.querySelector("span");

    if (themeIcon) {
      themeIcon.textContent =
        document.body.classList.contains("light") ? "☾" : "☼";
    }
  }

  updateThemeIcon();

  // Switch between light and dark mode
  if (themeButton) {
    themeButton.addEventListener("click", () => {
      document.body.classList.toggle("light");

      const selectedTheme =
        document.body.classList.contains("light")
          ? "light"
          : "dark";

      try {
        localStorage.setItem(
          "portfolio-theme",
          selectedTheme
        );
      } catch (error) {
        console.log("Theme preference could not be saved.");
      }

      updateThemeIcon();
    });
  }
});