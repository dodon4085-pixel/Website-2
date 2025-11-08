// ================================
// Dinhata Buzzer Hub - Admin Logic
// ================================

// Demo admin password (you can change this)
let adminPassword = "12345";

// Elements
const loginBtn = document.getElementById("loginBtn");
const adminPasswordInput = document.getElementById("adminPassword");
const loginStatus = document.getElementById("loginStatus");

// 🔹 Login System
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    const entered = adminPasswordInput.value.trim();
    if (entered === adminPassword) {
      localStorage.setItem("adminAuth", "true");
      window.location.href = "admin.html";
    } else {
      loginStatus.textContent = "❌ Wrong Password!";
    }
  });
}

// 🔹 Access Protection
if (window.location.pathname.includes("admin.html")) {
  const auth = localStorage.getItem("adminAuth");
  if (!auth) window.location.href = "index.html";
}

// Logout
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("adminAuth");
    window.location.href = "index.html";
  });
}

// ============================
// Sidebar Navigation
// ============================
const menuItems = document.querySelectorAll(".sidebar li");
const sections = document.querySelectorAll(".section");

menuItems.forEach((item) => {
  item.addEventListener("click", () => {
    menuItems.forEach((i) => i.classList.remove("active"));
    item.classList.add("active");
    const target = item.dataset.section;

    sections.forEach((sec) => {
      sec.classList.remove("active");
      if (sec.id === target) sec.classList.add("active");
    });
  });
});

// ============================
// Dark Mode Toggle
// ============================
const toggleTheme = document.getElementById("toggleTheme");
if (toggleTheme) {
  toggleTheme.addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });
}

// ============================
// Dashboard Data Simulation
// ============================
if (document.getElementById("dashboard")) {
  document.getElementById("totalProducts").textContent = 8;
  document.getElementById("totalOrders").textContent = 15;
  document.getElementById("totalUsers").textContent = 42;
  document.getElementById("totalRevenue").textContent = "₹18,500";
}

// ============================
// Product Management
// ============================
const productTable = document.querySelector("#productTable tbody");
const addProductBtn = document.getElementById("addProductBtn");

let products = JSON.parse(localStorage.getItem("products")) || [];

function renderProducts() {
  productTable.innerHTML = "";
  products.forEach((p, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${p.name}</td>
      <td>₹${p.price}</td>
      <td>
        <button class="edit-btn" onclick="editProduct(${i})">Edit</button>
        <button class="delete-btn" onclick="deleteProduct(${i})">Delete</button>
      </td>
    `;
    productTable.appendChild(row);
  });
}

function editProduct(i) {
  const newName = prompt("Edit Product Name:", products[i].name);
  const newPrice = prompt("Edit Product Price:", products[i].price);
  if (newName && newPrice) {
    products[i] = { name: newName, price: newPrice };
    localStorage.setItem("products", JSON.stringify(products));
    renderProducts();
    sendTelegram(`✏️ Product updated: ${newName} (₹${newPrice})`);
  }
}

function deleteProduct(i) {
  const name = products[i].name;
  products.splice(i, 1);
  localStorage.setItem("products", JSON.stringify(products));
  renderProducts();
  sendTelegram(`🗑️ Product deleted: ${name}`);
}

if (addProductBtn) {
  addProductBtn.addEventListener("click", () => {
    const name = prompt("Enter product name:");
    const price = prompt("Enter product price:");
    if (name && price) {
      products.push({ name, price });
      localStorage.setItem("products", JSON.stringify(products));
      renderProducts();
      sendTelegram(`🆕 New product added: ${name} (₹${price})`);
    }
  });
}

if (productTable) renderProducts();

// ============================
// Orders Management
// ============================
const orderTable = document.querySelector("#orderTable tbody");
let orders = [
  { id: 1, customer: "Rahul", status: "Pending" },
  { id: 2, customer: "Sneha", status: "Pending" },
];

function renderOrders() {
  orderTable.innerHTML = "";
  orders.forEach((o) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${o.id}</td>
      <td>${o.customer}</td>
      <td>${o.status}</td>
      <td><button class="ship-btn" onclick="markShipped(${o.id})">Mark Shipped</button></td>
    `;
    orderTable.appendChild(row);
  });
}

function markShipped(id) {
  const order = orders.find((o) => o.id === id);
  order.status = "Shipped";
  renderOrders();
  sendTelegram(`📦 Order #${id} marked as shipped.`);
}

if (orderTable) renderOrders();

// ============================
// Change Password
// ============================
const savePasswordBtn = document.getElementById("savePassword");
if (savePasswordBtn) {
  savePasswordBtn.addEventListener("click", () => {
    const newPass = document.getElementById("newPassword").value.trim();
    if (newPass.length < 4) return alert("Password too short!");
    adminPassword = newPass;
    sendTelegram(`🔐 Admin password changed.`);
    alert("Password updated successfully!");
  });
}

// ============================
// Telegram Bot Notification
// ============================
async function sendTelegram(message) {
  try {
    const token = TELEGRAM_CONFIG.BOT_TOKEN;
    const chatId = TELEGRAM_CONFIG.CHAT_ID;
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const payload = { chat_id: chatId, text: message };

    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    logToTelegramPanel(message);
  } catch (err) {
    console.error("Telegram Error:", err);
  }
}

// Show in Telegram Log panel
function logToTelegramPanel(msg) {
  const logBox = document.getElementById("telegramLog");
  if (logBox) {
    const line = document.createElement("p");
    line.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    logBox.prepend(line);
  }
}
