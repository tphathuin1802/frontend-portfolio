// Floating Music Button + Popup logic
(function () {
  const fab = document.getElementById("music-fab");
  const popup = document.getElementById("music-popup");
  const closeBtn = document.getElementById("music-popup-close");

  if (!fab || !popup || !closeBtn) return;

  function openPopup() {
    popup.classList.add("show");
    popup.setAttribute("aria-hidden", "false");
    popup.setAttribute("aria-modal", "true");
  }

  function closePopup() {
    popup.classList.remove("show");
    popup.setAttribute("aria-hidden", "true");
    popup.setAttribute("aria-modal", "false");
  }

  fab.addEventListener("click", () => {
    const isOpen = popup.classList.contains("show");
    if (isOpen) {
      closePopup();
    } else {
      openPopup();
    }
  });

  closeBtn.addEventListener("click", closePopup);

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (!popup.classList.contains("show")) return;
    const withinPopup = popup.contains(e.target) || fab.contains(e.target);
    if (!withinPopup) closePopup();
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && popup.classList.contains("show")) {
      closePopup();
    }
  });
})();


