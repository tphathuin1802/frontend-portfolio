document.addEventListener("DOMContentLoaded", function () {
  const typedTextSpan = document.getElementById("hero-title-typed");
  const textToType = "HI THERE<br>I'M PHAT HUYNH";
  let charIndex = 0;
  const typingSpeed = 150; // Speed of typing in ms
  const delayBeforeTyping = 500; // Delay before typing new text

  function type() {
    if (!typedTextSpan) return;

    if (textToType.substring(charIndex).startsWith("<br>")) {
      typedTextSpan.innerHTML = textToType.substring(0, charIndex + 4);
      charIndex += 4;
    } else {
      typedTextSpan.innerHTML = textToType.substring(0, charIndex + 1);
      charIndex++;
    }

    if (charIndex < textToType.length) {
      setTimeout(type, typingSpeed);
    } else {
      if (typedTextSpan.classList) {
        typedTextSpan.classList.add("typing-finished");
      }
    }
  }

  if (typedTextSpan) {
    setTimeout(type, delayBeforeTyping);
  }
});
