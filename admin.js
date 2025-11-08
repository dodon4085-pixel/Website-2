/* ===================================================
   🧠 Dinhata Buzzer Hub Admin Panel (Advanced)
   Password + Telegram + Dark Mode + Responsive
   =================================================== */

// Load Telegram Config
const { BOT_TOKEN, CHAT_ID, ADMIN_NAME } = TELEGRAM_CONFIG;

// ===== Password Protection =====
const ADMIN_PASSWORD = "buzzer@2025"; // 🔒 change as you like

const loginModal = document.getElementById("loginModal");
const loginForm = document.getElementById("loginForm");
const dashboard = document.getElementById("dashboard");

// Show modal on load
window.addEventListener("load", () => {
  loginModal.style.display = "flex";
  dashboard.style.display = "none";
});

// Login form submit
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const password = document.getElementById("adminPassword").value.trim();

  if (password === ADMIN_PASSWORD) {
    loginModal.style.display = "none";
    dashboard.style.display = "flex";
    sendTelegramMessage(`✅ ${ADMIN_NAME} just logged in to the admin panel.`);
  } else {
    alert("❌ Incorrect password!");
    sendTelegramMessage(`🚫 Failed admin login attempt detected.`);
  }
});

// ===== Telegram Integration =====
async function sendTelegramMessage(text) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  const payload = {
    chat_id: CHAT_ID,
    text: text,
    parse_mode: "HTML",
  };

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("Telegram Error:", err);
  }
}

// ===== Dark Mode Toggle =====
const darkToggle = document.getElementById("darkToggle");
darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  darkToggle.innerHTML = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

// ===== Sidebar Actions (optional demo) =====
document.querySelectorAll(".sidebar a").forEach((link) => {
  link.addEventListener("click", (e) => {
    document.querySelectorAll(".sidebar a").forEach((a) => a.classList.remove("active"));
    e.target.classList.add("active");

    const section = e.target.dataset.section;
    document.querySelectorAll(".card").forEach((c) => (c.style.display = "none"));
    if (section) document.getElementById(section).style.display = "block";
  });
});

// ===== Telegram Test Button =====
const testBtn = document.getElementById("testTelegram");
if (testBtn) {
  testBtn.addEventListener("click", () => {
    sendTelegramMessage(`🧪 Test message from ${ADMIN_NAME}'s admin panel.`);
    alert("Test message sent to Telegram ✅");
  });
}
