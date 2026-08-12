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
  const letters = "01 DATA AI CODE".split("");
  const fontSize = 13;

  let drops = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const columns = Math.floor(canvas.width / fontSize);
    drops = Array(columns).fill(1);
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
  if (!trigger || !projectScreen) return;

  let isOpen = false;
  let isTransitioning = false;

  function openProjects() {
    if (isOpen) return;
    projectScreen.classList.add("show");
    isOpen = true;
  }

  function closeProjects() {
    if (!isOpen) return;
    projectScreen.classList.remove("show");
    isOpen = false;
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

  // Guards a single wheel/touch gesture so a boundary scroll can't
  // fire close() and scrollIntoView() multiple times in a row.
  function withTransitionLock(action, lockMs) {
    if (isTransitioning) return;
    isTransitioning = true;
    action();
    setTimeout(() => {
      isTransitioning = false;
    }, lockMs);
  }

  function goToContact() {
    setTimeout(function () {
      document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
    }, 300);
  }

  /* Desktop mouse wheel control */

  projectScreen.addEventListener(
    "wheel",
    function (event) {
      const atTop = projectScreen.scrollTop <= 0;
      const atBottom =
        projectScreen.scrollTop + projectScreen.clientHeight >=
        projectScreen.scrollHeight - 5;

      if (event.deltaY < 0 && atTop) {
        withTransitionLock(closeProjects, 600);
        return;
      }

      if (event.deltaY > 0 && atBottom) {
        withTransitionLock(function () {
          closeProjects();
          goToContact();
        }, 900);
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
      event.stopPropagation();

      const touchEndY = event.touches[0].clientY;
      const atTop = projectScreen.scrollTop <= 0;
      const atBottom =
        projectScreen.scrollTop + projectScreen.clientHeight >=
        projectScreen.scrollHeight - 5;

      if (touchEndY > touchStartY && atTop) {
        withTransitionLock(closeProjects, 600);
        return;
      }

      if (touchEndY < touchStartY && atBottom) {
        withTransitionLock(function () {
          closeProjects();
          goToContact();
        }, 900);
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
