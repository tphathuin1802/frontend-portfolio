// Arrow icon chuyển section
function scrollToNextSection(el) {
  let section = el.closest("section");
  if (section) {
    let next = section.nextElementSibling;
    // Lặp đến khi gặp section tiếp theo
    while (
      next &&
      (next.nodeType !== 1 || next.tagName.toLowerCase() !== "section")
    ) {
      next = next.nextElementSibling;
    }
    if (next) {
      next.scrollIntoView({ behavior: "smooth" });
    }
  }
}

// Animation configuration
const ANIMATION = {
  THRESHOLD: 0.1,
  ROOT_MARGIN: "0px",
};

// Animation observer
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        // Optional: Unobserve after animation
        // observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: ANIMATION.THRESHOLD,
    rootMargin: ANIMATION.ROOT_MARGIN,
  }
);

// Initialize animations
function initAnimations() {
  // Observe all sections
  document.querySelectorAll("section").forEach((section) => {
    observer.observe(section);
  });

  // Add animation classes to elements
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.classList.add("scale-in");
  });

  // Add fade-in to specific elements
  document.querySelectorAll(".fade-in-element").forEach((element) => {
    element.classList.add("fade-in");
  });

  // Add slide-up to specific elements
  document.querySelectorAll(".slide-up-element").forEach((element) => {
    element.classList.add("slide-up");
  });
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Intersection Observer for fade-in elements
  const fadeElements = document.querySelectorAll(".fade-in-element");
  const slideElements = document.querySelectorAll(".slide-up-element");
  const scaleElements = document.querySelectorAll(".scale-in-element");

  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: "0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        // Unobserve after animation
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all animation elements
  fadeElements.forEach((el) => observer.observe(el));
  slideElements.forEach((el) => observer.observe(el));
  scaleElements.forEach((el) => observer.observe(el));

  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navLinksContainer = document.querySelector(".nav-links");

  if (mobileMenuBtn && navLinksContainer) {
    mobileMenuBtn.addEventListener("click", () => {
      navLinksContainer.classList.toggle("active");
      mobileMenuBtn.setAttribute(
        "aria-expanded",
        navLinksContainer.classList.contains("active").toString()
      );
    });
  }

  // Active link highlighting / Scroll Spy
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll('.nav-links .nav-link[href^="#"]');
  const navHeight = document.getElementById("navbar")?.offsetHeight || 85;

  function changeActiveLink() {
    let currentSectionId = "";
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - navHeight - 15;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute("id");
      }
    });

    if (
      window.innerHeight + window.pageYOffset >=
      document.body.offsetHeight - 2
    ) {
      if (sections.length > 0) {
        currentSectionId = sections[sections.length - 1].getAttribute("id");
      }
    }

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + currentSectionId) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", changeActiveLink);
  window.addEventListener("load", changeActiveLink);
  changeActiveLink();

  // Arrow Down Button scroll behavior
  const arrowBtn = document.getElementById("arrowDownBtn");
  if (arrowBtn) {
    let lastClick = 0;
    arrowBtn.addEventListener("click", function (e) {
      const now = Date.now();
      if (now - lastClick < 300) return; // ignore if double click
      lastClick = now;
      // Scroll to next section
      const hero = document.getElementById("home");
      let nextSection = hero && hero.nextElementSibling;
      while (nextSection && nextSection.tagName !== "SECTION") {
        nextSection = nextSection.nextElementSibling;
      }
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: "smooth" });
      }
    });
    arrowBtn.addEventListener("dblclick", function (e) {
      // Scroll to footer
      const footer = document.querySelector("footer");
      if (footer) {
        footer.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  const animatedElements = document.querySelectorAll(
    ".fade-in-element, .slide-up-element, .scale-in-element, .animated-item"
  );

  // Intersection Observer for Animations
  /* // Commenting out the observer logic to let ScrollReveal handle section animations
  const observer = new IntersectionObserver(
    (entries, observerInstance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          // Optional: Stop observing after animation
          // observerInstance.unobserve(entry.target);
        }
        // Optional: Remove 'visible' class when element leaves viewport for re-animation
        // else {
        //   entry.target.classList.remove("visible");
        // }
      });
    },
    {
      threshold: 0.1, // Trigger when 10% of the element is visible
      // rootMargin: '0px 0px -50px 0px' // Adjust rootMargin if needed
    }
  );

  animatedElements.forEach((el) => {
    observer.observe(el);
  });
  */
});
