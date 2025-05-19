// DOM Elements
const elements = {
  themeToggle: document.getElementById("theme-toggle"),
  themeIcon: document.querySelector("#theme-toggle i"),
  body: document.body,
  mobileMenuBtn: document.querySelector(".mobile-menu-btn"),
  navLinks: document.querySelector(".nav-links"),
  sections: document.querySelectorAll("section[id]"),
  navItems: document.querySelectorAll(".nav-link"),
};

// Theme Management
const themeManager = {
  init() {
    this.loadTheme();
    this.setupEventListeners();
  },

  loadTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      this.applyTheme("dark");
    } else {
      this.applyTheme("light");
    }
  },

  setupEventListeners() {
    elements.themeToggle?.addEventListener("click", () => this.toggleTheme());
  },

  toggleTheme() {
    const isDark = elements.body.classList.contains("dark-theme");
    this.applyTheme(isDark ? "light" : "dark");
  },

  applyTheme(theme) {
    // Update body class
    elements.body.classList.remove("dark-theme", "light-theme");
    elements.body.classList.add(`${theme}-theme`);

    // Update icon
    elements.themeIcon.className = `fas fa-${
      theme === "dark" ? "sun" : "moon"
    }`;

    // Save preference
    localStorage.setItem("theme", theme);
  },
};

// Navigation Management
const navigationManager = {
  init() {
    this.setupEventListeners();
    this.updateActiveLink();
  },

  setupEventListeners() {
    // Mobile menu toggle
    elements.mobileMenuBtn?.addEventListener("click", () =>
      this.toggleMobileMenu()
    );

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => this.handleOutsideClick(e));

    // Smooth scroll and active state for nav items
    elements.navItems.forEach((link) => {
      link.addEventListener("click", (e) => this.handleNavClick(e));
    });

    // Update active link on scroll
    window.addEventListener("scroll", () => this.updateActiveLink());
    window.addEventListener("resize", () => this.handleResize());
  },

  toggleMobileMenu() {
    const isExpanded = elements.navLinks.classList.toggle("active");
    elements.mobileMenuBtn.setAttribute("aria-expanded", isExpanded);

    const menuIcon = elements.mobileMenuBtn.querySelector("i");
    menuIcon.classList.toggle("fa-bars");
    menuIcon.classList.toggle("fa-times");
  },

  closeMobileMenu() {
    elements.navLinks.classList.remove("active");
    elements.mobileMenuBtn.setAttribute("aria-expanded", false);
    const menuIcon = elements.mobileMenuBtn.querySelector("i");
    menuIcon.classList.replace("fa-times", "fa-bars");
  },

  handleOutsideClick(e) {
    if (
      !elements.mobileMenuBtn.contains(e.target) &&
      !elements.navLinks.contains(e.target)
    ) {
      this.closeMobileMenu();
    }
  },

  handleNavClick(e) {
    const link = e.currentTarget;
    if (link.getAttribute("href").startsWith("#")) {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
        this.closeMobileMenu();
      }
    }
  },

  updateActiveLink() {
    const scrollPosition = window.scrollY + 100; // Offset for fixed header

    elements.sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        elements.navItems.forEach((item) => {
          const isActive = item.getAttribute("href") === `#${sectionId}`;
          item.classList.toggle("active", isActive);
        });
      }
    });
  },

  handleResize() {
    if (window.innerWidth > 768) {
      this.closeMobileMenu();
    }
  },
};

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  themeManager.init();
  navigationManager.init();
});

// Theme toggle functionality
document.addEventListener("DOMContentLoaded", () => {
  const themeToggles = document.querySelectorAll(
    "#theme-toggle-header, #theme-toggle-nav"
  );
  const body = document.body;

  // Check for saved user preference, if any, on load of the website
  const darkMode = localStorage.getItem("darkMode");

  // If the user previously enabled dark mode, apply it
  if (darkMode === "enabled") {
    body.classList.add("dark-mode");
    themeToggles.forEach((toggle) => {
      const icon = toggle.querySelector("i");
      icon.classList.remove("fa-moon");
      icon.classList.add("fa-sun");
    });
  }

  // When someone clicks the button
  themeToggles.forEach((button) => {
    button.addEventListener("click", () => {
      // Toggle dark mode on
      body.classList.toggle("dark-mode");

      // Update icons
      themeToggles.forEach((toggle) => {
        const icon = toggle.querySelector("i");
        if (body.classList.contains("dark-mode")) {
          icon.classList.remove("fa-moon");
          icon.classList.add("fa-sun");
          localStorage.setItem("darkMode", "enabled");
        } else {
          icon.classList.remove("fa-sun");
          icon.classList.add("fa-moon");
          localStorage.setItem("darkMode", null);
        }
      });
    });
  });
});
