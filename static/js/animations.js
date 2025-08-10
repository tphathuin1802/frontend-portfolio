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

  // Projects filter buttons (scoped to #projects)
  const projectsSection = document.querySelector("#projects");
  const filterContainer = projectsSection?.querySelector(".projects-filters");
  const filterButtons =
    projectsSection?.querySelectorAll(".projects-filters .filter-btn") || [];
  function applyFilter(category) {
    const allCards = document.querySelectorAll(
      "#projects .projects-grid .project-card"
    );
    let visibleCount = 0;

    allCards.forEach((card) => {
      const cardCategory = card.getAttribute("data-category") || "";
      const shouldShow = category === cardCategory;
      card.classList.toggle("is-hidden", !shouldShow);
      if (shouldShow) {
        visibleCount += 1;
        // Ensure visible even if ScrollReveal hid it
        card.style.visibility = "visible";
        card.style.opacity = "1";
        card.style.transform = "none";
        card.removeAttribute("data-sr-id");
      }
    });

    // Empty state message
    let empty = document.querySelector("#projects .projects-empty-state");
    if (!empty) {
      empty = document.createElement("div");
      empty.className = "projects-empty-state";
      empty.textContent = "No projects in this category (updating soon).";
      const container = document.querySelector("#projects .section-container");
      container?.appendChild(empty);
    }
    empty.style.display = visibleCount === 0 ? "block" : "none";

    // Re-run ScrollReveal for shown cards if available
    try {
      if (typeof sr !== "undefined" && visibleCount > 0) {
        sr.reveal("#projects .projects-grid .project-card:not(.is-hidden)", {
          reset: false,
        });
      }
    } catch (e) {
      // no-op if ScrollReveal not ready
    }

    // Persist selection
    try {
      localStorage.setItem("projects.activeFilter", category);
    } catch (e) {}
  }

  // Work (references) filter buttons
  const workSection = document.querySelector("#work");
  const workFilterContainer = workSection?.querySelector(".projects-filters");
  const workFilterButtons =
    workSection?.querySelectorAll(".projects-filters .filter-btn") || [];

  function applyWorkFilter(category) {
    const allCards =
      workSection?.querySelectorAll(".work-grid .reference-card") || [];
    let visibleCount = 0;

    allCards.forEach((card) => {
      const cardCategory = card.getAttribute("data-category") || "";
      const shouldShow = category === cardCategory;
      card.classList.toggle("is-hidden", !shouldShow);
      if (shouldShow) {
        visibleCount += 1;
        card.style.visibility = "visible";
        card.style.opacity = "1";
        card.style.transform = "none";
        card.removeAttribute("data-sr-id");
      }
    });

    // Empty state message for Work
    let empty = workSection?.querySelector(".projects-empty-state");
    if (!empty && workSection) {
      empty = document.createElement("div");
      empty.className = "projects-empty-state";
      empty.textContent = "No items in this category (updating soon).";
      workSection.querySelector(".section-container")?.appendChild(empty);
    }
    if (empty) empty.style.display = visibleCount === 0 ? "block" : "none";

    try {
      localStorage.setItem("work.activeFilter", category);
    } catch (e) {}
  }

  if (workFilterContainer && workFilterButtons.length) {
    workFilterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        workFilterButtons.forEach((b) => {
          b.classList.remove("active");
          b.setAttribute("aria-selected", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");
        const selected = btn.getAttribute("data-filter");
        applyWorkFilter(selected);
      });
    });

    // Initialize Work filter
    let saved = null;
    try {
      saved = localStorage.getItem("work.activeFilter");
    } catch (e) {}
    const initialBtn = saved
      ? workFilterContainer.querySelector(`.filter-btn[data-filter="${saved}"]`)
      : workFilterContainer.querySelector(".filter-btn.active");
    if (initialBtn) {
      workFilterButtons.forEach((b) => b.classList.remove("active"));
      initialBtn.classList.add("active");
      initialBtn.setAttribute("aria-selected", "true");
      applyWorkFilter(initialBtn.getAttribute("data-filter"));
    }
  }

  if (filterContainer && filterButtons.length) {
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterButtons.forEach((b) => {
          b.classList.remove("active");
          b.setAttribute("aria-selected", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");
        const selected = btn.getAttribute("data-filter");
        applyFilter(selected);
      });
    });

    // Initialize from saved filter or active button
    let saved = null;
    try {
      saved = localStorage.getItem("projects.activeFilter");
    } catch (e) {}
    const initialBtn = saved
      ? filterContainer.querySelector(`.filter-btn[data-filter="${saved}"]`)
      : filterContainer.querySelector(".filter-btn.active");
    if (initialBtn) {
      filterButtons.forEach((b) => b.classList.remove("active"));
      initialBtn.classList.add("active");
      initialBtn.setAttribute("aria-selected", "true");
      applyFilter(initialBtn.getAttribute("data-filter"));
    }
  }

  // Drag-to-scroll for Work section marquee
  (function initWorkDragScroll() {
    const workGrid = document.querySelector("#work .work-grid");
    if (!workGrid) return;
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onDown = (e) => {
      isDown = true;
      workGrid.classList.add("is-dragging");
      startX = (e.touches ? e.touches[0].pageX : e.pageX) - workGrid.offsetLeft;
      scrollLeft = workGrid.scrollLeft;
    };
    const onLeaveUp = () => {
      isDown = false;
      workGrid.classList.remove("is-dragging");
    };
    const onMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x =
        (e.touches ? e.touches[0].pageX : e.pageX) - workGrid.offsetLeft;
      const walk = (x - startX) * 1; // scroll-fastness factor
      workGrid.scrollLeft = scrollLeft - walk;
    };

    workGrid.addEventListener("mousedown", onDown);
    workGrid.addEventListener("mouseleave", onLeaveUp);
    workGrid.addEventListener("mouseup", onLeaveUp);
    workGrid.addEventListener("mousemove", onMove);
    workGrid.addEventListener("touchstart", onDown, { passive: false });
    workGrid.addEventListener("touchend", onLeaveUp);
    workGrid.addEventListener("touchcancel", onLeaveUp);
    workGrid.addEventListener("touchmove", onMove, { passive: false });
  })();

  // Populate Moment cards from image list
  (function populateMomentCards() {
    const workTrack = document.querySelector("#work .work-grid .work-track");
    if (!workTrack) return;
    const momentImages = [
      "moment_corner_code.png",
      "moment_chill.png",
      "moment_vibe.png",
      "moment_onepiece.png",
      "moment_family.png",
      "moment_coding_2.png",
      "moment_coding_1.png",
      "moment_coding.png",
      "moment_tuyensinh.png",
      "moment_data.png",
      "moment_christmas.png",
    ];

    momentImages.forEach((file) => {
      const card = document.createElement("div");
      card.className = "reference-card";
      card.setAttribute("data-category", "moment");

      const imgWrap = document.createElement("div");
      imgWrap.className = "reference-image";
      const img = document.createElement("img");
      img.src = `static/images/${file}`;
      img.alt = file
        .replace(/^moment_/, "")
        .replace(/[_-]+/g, " ")
        .replace(/\.[^.]+$/, "")
        .trim();
      img.loading = "lazy";
      imgWrap.appendChild(img);

      const content = document.createElement("div");
      content.className = "reference-content";
      const title = document.createElement("h4");
      const pretty = img.alt.replace(/\b\w/g, (m) => m.toUpperCase());
      title.textContent = pretty || "Moment";
      content.appendChild(title);

      card.appendChild(imgWrap);
      card.appendChild(content);
      workTrack.appendChild(card);
    });
  })();
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
