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

  function setTeamBasedOnRealTime() {
    const hour = new Date().getHours();
    // Dark mode between 6 PM (18) and 6 AM (5:59)
    const isDarkModeTime = hour >= 18 || hour < 6;
    const currentTheme = body.classList.contains("dark-mode")
      ? "enabled"
      : null;

    if (isDarkModeTime) {
      if (currentTheme !== "enabled") {
        body.classList.add("dark-mode");
        updateIconsAndStorage("enabled");
      }
    } else {
      if (currentTheme === "enabled") {
        body.classList.remove("dark-mode");
        updateIconsAndStorage(null);
      }
    }
  }

  function updateIconsAndStorage(darkModeStatus) {
    themeToggles.forEach((toggle) => {
      const icon = toggle.querySelector("i");
      if (darkModeStatus === "enabled") {
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
      } else {
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
      }
    });
    localStorage.setItem("darkMode", darkModeStatus);
  }

  // Attempt to set theme based on time initially
  // User preference from localStorage will override this if it exists and differs
  setTeamBasedOnRealTime();

  // Check for saved user preference, if any, on load of the website
  const savedDarkMode = localStorage.getItem("darkMode");

  // If the user previously set a theme, respect it over the time-based one
  // but only if it's different from what time-based logic would set
  if (savedDarkMode !== null) {
    const isDarkModeTime =
      new Date().getHours() >= 18 || new Date().getHours() < 6;
    const timeBasedTheme = isDarkModeTime ? "enabled" : null;
    if (savedDarkMode !== timeBasedTheme) {
      if (savedDarkMode === "enabled") {
        body.classList.add("dark-mode");
        updateIconsAndStorage("enabled");
      } else {
        body.classList.remove("dark-mode");
        updateIconsAndStorage(null);
      }
    }
  }

  // When someone clicks the button for manual toggle
  themeToggles.forEach((button) => {
    button.addEventListener("click", () => {
      body.classList.toggle("dark-mode");
      const newDarkModeStatus = body.classList.contains("dark-mode")
        ? "enabled"
        : null;
      updateIconsAndStorage(newDarkModeStatus);
    });
  });
});
