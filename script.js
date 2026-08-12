"use strict";

/* =========================================================
   LANGUAGE STRINGS (EN / DE)
========================================================= */

const LANG = document.documentElement.lang === "de" ? "de" : "en";

const STRINGS = {
  en: {
    welcomeText: "Welcome to Emran Azizi Portfolio",
    systemReady: "System Ready",
    sendSuccess: "Message sent successfully!",
    sendFail: "Failed to send message.",
  },
  de: {
    welcomeText: "Willkommen im Portfolio von Emran Azizi",
    systemReady: "System Bereit",
    sendSuccess: "Nachricht erfolgreich gesendet!",
    sendFail: "Nachricht konnte nicht gesendet werden.",
  },
};

const t = STRINGS[LANG];

/* =========================================================
   MATRIX BACKGROUND ANIMATION
========================================================= */

(function initMatrixBackground() {
  const canvas = document.getElementById("code");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const letters = "Emran Azizi 001".split("");
  const fontSize = 13;

  let drops = [];

  function resetDrops() {
    const columns = Math.floor(canvas.width / fontSize);
    drops = Array(columns).fill(1);
  }

  function resizeCanvas() {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    if (canvas.width === newWidth && canvas.height === newHeight) return;

    // Mobile browsers fire "resize" on scroll too (the address bar
    // showing/hiding changes window.innerHeight), which was rebuilding
    // the drops on every scroll and making the rain look like it kept
    // restarting. Only rebuild them when the column count (i.e. the
    // width) actually changes — a height-only change just resizes the
    // canvas without resetting where each column currently is.
    const columnsBefore = drops.length;

    canvas.width = newWidth;
    canvas.height = newHeight;

    const columnsAfter = Math.floor(canvas.width / fontSize);

    if (columnsAfter !== columnsBefore) {
      drops = Array(columnsAfter).fill(1);
    }
  }

  function drawMatrix() {
    ctx.fillStyle = "rgba(0,0,0,0.03)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(0,247,255,0.20)";
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
      const text = letters[Math.floor(Math.random() * letters.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.98) {
        drops[i] = 0;
      }

      drops[i]++;
    }
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  setInterval(drawMatrix, 80);

  // Restart the rain from the top every 2 minutes.
  setInterval(resetDrops, 120000);
})();

/* =========================================================
   EMAILJS CONTACT FORM
========================================================= */

function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form || typeof emailjs === "undefined") return;

  emailjs.init("hhxgoyeEfEqFF-TxH");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    emailjs
      .send("service_emran", "template_y6hwt0b", {
        name: form.name.value,
        email: form.email.value,
        message: form.message.value,
      })
      .then(() => {
        alert(t.sendSuccess);
        form.reset();
      })
      .catch((error) => {
        console.error("EmailJS error:", error);
        alert(t.sendFail);
      });
  });
}

/* =========================================================
   WELCOME / SPLASH SCREEN
========================================================= */

function initWelcomeScreen() {
  const screen = document.getElementById("welcome-screen");
  const typingEl = document.getElementById("typing-text");
  if (!screen || !typingEl) return;

  const text = t.welcomeText;
  let index = 0;

  // Lock page scroll while the splash sequence plays so the project
  // scroll-jacking logic below can't be triggered before it's ready.
  document.body.classList.add("is-loading");

  function typeText() {
    if (index < text.length) {
      typingEl.textContent += text.charAt(index);
      index++;
      setTimeout(typeText, 55);
    }
  }

  typeText();

  setTimeout(() => {
    typingEl.classList.add("glitch");
  }, 1200);

  setTimeout(() => {
    typingEl.classList.remove("glitch");
    typingEl.textContent = t.systemReady;
  }, 2500);

  setTimeout(() => {
    screen.style.opacity = "0";

    setTimeout(() => {
      screen.style.display = "none";
      document.body.classList.remove("is-loading");
      document.body.classList.add("loaded");
    }, 800);
  }, 3800);
}

/* =========================================================
   PROJECT FULL-SCREEN SLIDE CONTROL
========================================================= */

function initProjectSlider() {
  const trigger = document.getElementById("projects-trigger");
  const projectScreen = document.getElementById("projects-screen");
  const closeBtn = document.getElementById("projects-close");
  if (!trigger || !projectScreen) return;

  // How long after opening to ignore close gestures — stops the scroll
  // momentum that opened the panel from immediately bouncing it shut again.
  const OPEN_SETTLE_MS = 600;

  // A boundary scroll only closes the panel once this much total wheel
  // movement (or touch swipe distance) has built up in the same direction —
  // this is what stops a single small trackpad tick from closing it instantly.
  const WHEEL_CLOSE_THRESHOLD = 140;
  const TOUCH_CLOSE_THRESHOLD = 60;

  let isOpen = false;
  let openedAt = 0;
  let wheelAccumulator = 0;
  let wheelResetTimer = null;

  function justOpened() {
    return Date.now() - openedAt < OPEN_SETTLE_MS;
  }

  function openProjects() {
    if (isOpen) return;
    projectScreen.classList.add("show");

    if (closeBtn) {
      closeBtn.classList.add("show", "pulse");
      setTimeout(() => closeBtn.classList.remove("pulse"), 2300);
    }

    isOpen = true;
    openedAt = Date.now();
    wheelAccumulator = 0;
  }

  function closeProjects() {
    if (!isOpen) return;
    projectScreen.classList.remove("show");
    if (closeBtn) closeBtn.classList.remove("show", "pulse");
    isOpen = false;
    wheelAccumulator = 0;
  }

  // Opens the panel once the trigger section fills the viewport.
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          openProjects();
        }
      });
    },
    { threshold: 0.9 },
  );

  observer.observe(trigger);

  if (closeBtn) {
    closeBtn.addEventListener("click", closeProjects);
  }

  // Closing via the nav (instead of scrolling) so the panel doesn't stay
  // covering the section the link just navigated to.
  document.querySelectorAll('nav a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function () {
      if (isOpen) closeProjects();
    });
  });

  function goToContact() {
    setTimeout(function () {
      document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
    }, 300);
  }

  /* Desktop mouse wheel control */

  projectScreen.addEventListener(
    "wheel",
    function (event) {
      if (!isOpen || justOpened()) return;

      const atTop = projectScreen.scrollTop <= 0;
      const atBottom =
        projectScreen.scrollTop + projectScreen.clientHeight >=
        projectScreen.scrollHeight - 2;

      const closingUp = event.deltaY < 0 && atTop;
      const closingDown = event.deltaY > 0 && atBottom;

      if (!closingUp && !closingDown) {
        wheelAccumulator = 0;
        return;
      }

      wheelAccumulator += Math.abs(event.deltaY);
      clearTimeout(wheelResetTimer);
      wheelResetTimer = setTimeout(() => {
        wheelAccumulator = 0;
      }, 400);

      if (wheelAccumulator < WHEEL_CLOSE_THRESHOLD) return;

      wheelAccumulator = 0;

      if (closingUp) {
        closeProjects();
      } else {
        closeProjects();
        goToContact();
      }
    },
    { passive: true },
  );

  /* iPhone / iPad touch control */

  let touchStartY = 0;

  projectScreen.addEventListener(
    "touchstart",
    function (event) {
      touchStartY = event.touches[0].clientY;
    },
    { passive: true },
  );

  projectScreen.addEventListener(
    "touchmove",
    function (event) {
      if (!isOpen || justOpened()) return;

      event.stopPropagation();

      const swipeDistance = event.touches[0].clientY - touchStartY;
      const atTop = projectScreen.scrollTop <= 0;
      const atBottom =
        projectScreen.scrollTop + projectScreen.clientHeight >=
        projectScreen.scrollHeight - 2;

      if (swipeDistance > TOUCH_CLOSE_THRESHOLD && atTop) {
        closeProjects();
      } else if (swipeDistance < -TOUCH_CLOSE_THRESHOLD && atBottom) {
        closeProjects();
        goToContact();
      }
    },
    { passive: true },
  );
}

/* =========================================================
   MOBILE VIEWPORT HEIGHT FIX (iPhone / iPad / Android)
========================================================= */

function initMobileViewportFix() {
  function updateViewportHeight() {
    document.documentElement.style.setProperty(
      "--vh",
      `${window.innerHeight * 0.01}px`,
    );
  }

  updateViewportHeight();
  window.addEventListener("resize", updateViewportHeight);
}

/* =========================================================
   PREVENT DOUBLE-TAP ZOOM ON BUTTONS / LINKS
========================================================= */

function initTouchTargets() {
  document.querySelectorAll("a, button").forEach(function (element) {
    element.style.touchAction = "manipulation";
  });
}

/* =========================================================
   BOOTSTRAP
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  initContactForm();
  initProjectSlider();
  initMobileViewportFix();
  initTouchTargets();
});

window.addEventListener("load", initWelcomeScreen);
