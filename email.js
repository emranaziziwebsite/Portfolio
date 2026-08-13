"use strict";

/* =========================================================
   CONTACT FORM — EMAILJS INTEGRATION
   =========================================================
   Sends the "Send Me a Message" form on the Contact section
   through EmailJS, so messages land straight in your inbox
   with no backend server needed.

   ---------------------------------------------------------
   HOW TO CONNECT THIS TO YOUR OWN EMAIL (one-time setup)
   ---------------------------------------------------------
   1. Go to https://www.emailjs.com and sign up (use whichever
      account you like — it does NOT have to match the inbox
      you want to receive messages at).

   2. Email Services (left sidebar) -> Add New Service.
      Connect the inbox you actually want messages delivered
      to (e.g. Gmail) and authorize it. Copy the generated
      "Service ID" into PUBLIC_CONFIG.serviceId below.

   3. Email Templates -> Create New Template. Set the "To Email"
      field to your address, and use these variables in the
      template body so the form data shows up:
        {{name}}    - sender's name
        {{email}}   - sender's email (also set as "Reply To")
        {{message}} - the message text
      Copy the generated "Template ID" into
      PUBLIC_CONFIG.templateId below.

   4. Account -> General -> copy your "Public Key" into
      PUBLIC_CONFIG.publicKey below.

   That's it — no other code changes needed. The Public Key is
   safe to expose in client-side code; it only allows sending
   through templates you've already configured.
========================================================= */

const PUBLIC_CONFIG = {
  publicKey: "OXIbW1VaI8_XMNL_x",
  serviceId: "service_nr9bbxk",
  templateId: "template_293m1ko",
};

const EMAIL_STRINGS = {
  en: {
    sendSuccess: "Message sent successfully!",
    sendFail: "Failed to send message.",
  },
  de: {
    sendSuccess: "Nachricht erfolgreich gesendet!",
    sendFail: "Nachricht konnte nicht gesendet werden.",
  },
};

function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form || typeof emailjs === "undefined") return;

  const lang = document.documentElement.lang === "de" ? "de" : "en";
  const strings = EMAIL_STRINGS[lang];

  emailjs.init(PUBLIC_CONFIG.publicKey);

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    emailjs
      .send(PUBLIC_CONFIG.serviceId, PUBLIC_CONFIG.templateId, {
        name: form.name.value,
        email: form.email.value,
        message: form.message.value,
      })
      .then(() => {
        alert(strings.sendSuccess);
        form.reset();
      })
      .catch((error) => {
        console.error("EmailJS error:", error);
        alert(strings.sendFail);
      });
  });
}

document.addEventListener("DOMContentLoaded", initContactForm);
