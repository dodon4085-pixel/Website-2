// ================================
// 🔐 Admin Password Setup
// ================================
const ADMIN_PASSWORD = "12345"; // Change if needed

// ================================
// 🤖 Telegram Bot Configuration
// ================================
const BOT_TOKEN = "8589527391:AAEF3bCeKx0J-y9dc0KHeJCOolzHLJjYVo4"; // dummy token
const CHAT_ID = "7681046220"; // dummy ID

// ================================
// 🧭 Login System
// ================================
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const adminPassword = document.getElementById("adminPassword");
  const loginStatus = document.getElementById("loginStatus");

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      const password = adminPassword.value.trim();

      if (password === ADMIN_PASSWORD) {
        localStorage.setItem("adminAccess", "true");
        window.location.href = "admin.html";
      } else {
        loginStatus.innerText = "❌ Incorrect password!";
        loginStatus.style.color = "red";
      }
    });
  }

  // Protect admin panel
  if (window.location.pathname.includes("admin.html")) {
    if (localStorage.getItem("adminAccess") !== "true") {
      window.location.href = "index.html";
    }
  }
});

// ================================
// 🧠 Telegram Bot Functions
// ================================
function sendTelegramMessage(message) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  const data = {
    chat_id: CHAT_ID,
    text: message,
    parse_mode: "HTML",
  };

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).catch((err) => console.error("Telegram Error:", err));
}

// ================================
// ⚙️ Admin Advanced Features
// ================================
function backupData() {
  const data = localStorage.getItem("cart") || "No Data Found";
  const message = `🗃 <b>Backup Data</b>\n\n${data}`;
  sendTelegramMessage(message);
  alert("✅ Backup data sent to Telegram!");
}

function clearCart() {
  localStorage.removeItem("cart");
  alert("🧹 All cart data cleared!");
}

function sendCustomAlert() {
  const msg = prompt("Enter custom message to send:");
  if (msg) {
    sendTelegramMessage(`📢 <b>Admin Alert:</b>\n${msg}`);
    alert("✅ Message sent to Telegram!");
  }
}

// ================================
// 🧾 Product & Order Dummy System (Optional Demo)
// ================================
function sendOrderNotification(orderDetails) {
  const message = `
🛍 <b>New Order Received</b>
-----------------------
${orderDetails}
`;
  sendTelegramMessage(message);
}

// Expose globally
window.backupData = backupData;
window.clearCart = clearCart;
window.sendCustomAlert = sendCustomAlert;
