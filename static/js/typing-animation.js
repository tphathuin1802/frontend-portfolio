document.addEventListener("DOMContentLoaded", function () {
  // Typing effect for subtitle with loop
  const typingTextSpan = document.getElementById("typing-text");
  const textsToType = [
    "Data Science enthusiast",
    "Data Analyst",
    "Welcome to my portfolio!",
  ];
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 100; // Speed of typing in ms
  const deletingSpeed = 50; // Speed of deleting in ms
  const delayBeforeTyping = 1500; // Initial delay
  const delayBetweenTexts = 2000; // Delay between complete text and start deleting
  const delayAfterDeleting = 500; // Delay after deleting before typing next text

  function typeSubtitle() {
    if (!typingTextSpan) return;

    const currentText = textsToType[textIndex];

    if (!isDeleting) {
      // Typing
      if (charIndex < currentText.length) {
        typingTextSpan.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        setTimeout(typeSubtitle, typingSpeed);
      } else {
        // Finished typing, wait then start deleting
        setTimeout(() => {
          isDeleting = true;
          typeSubtitle();
        }, delayBetweenTexts);
      }
    } else {
      // Deleting
      if (charIndex > 0) {
        typingTextSpan.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        setTimeout(typeSubtitle, deletingSpeed);
      } else {
        // Finished deleting, move to next text
        isDeleting = false;
        textIndex = (textIndex + 1) % textsToType.length;
        setTimeout(typeSubtitle, delayAfterDeleting);
      }
    }
  }

  if (typingTextSpan) {
    setTimeout(typeSubtitle, delayBeforeTyping);
  }

  // Original typing effect for title (if exists)
  const typedTextSpan = document.getElementById("hero-title-typed");
  if (typedTextSpan) {
    const titleTextToType = "HI THERE<br>I'M PHAT HUYNH";
    let titleCharIndex = 0;
    const titleTypingSpeed = 150;
    const titleDelayBeforeTyping = 500;

    function typeTitle() {
      if (titleTextToType.substring(titleCharIndex).startsWith("<br>")) {
        typedTextSpan.innerHTML = titleTextToType.substring(
          0,
          titleCharIndex + 4
        );
        titleCharIndex += 4;
      } else {
        typedTextSpan.innerHTML = titleTextToType.substring(
          0,
          titleCharIndex + 1
        );
        titleCharIndex++;
      }

      if (titleCharIndex < titleTextToType.length) {
        setTimeout(typeTitle, titleTypingSpeed);
      } else {
        if (typedTextSpan.classList) {
          typedTextSpan.classList.add("typing-finished");
        }
      }
    }

    setTimeout(typeTitle, titleDelayBeforeTyping);
  }
});
