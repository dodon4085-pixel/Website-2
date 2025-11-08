// ==========================
// 🔧 Dinhata Buzzer Hub - Admin Control Script
// ==========================

console.log("Admin control panel initialized ✅");

// 🧩 Default Config (imported from config.js)
const ADMIN_CONFIG = {
    defaultPassword: "admin123",
};

// ==========================
// 🔐 Password Management
// ==========================
function changeAdminPassword() {
    const oldPass = prompt("Enter current password:");
    const savedPass = localStorage.getItem("adminPass") || ADMIN_CONFIG.defaultPassword;

    if (oldPass !== savedPass) {
        alert("❌ Wrong current password!");
        return;
    }

    const newPass = prompt("Enter new password:");
    if (!newPass || newPass.length < 4) {
        alert("⚠️ Password must be at least 4 characters!");
        return;
    }

    localStorage.setItem("adminPass", newPass);
    alert("✅ Password changed successfully!");
}

// ==========================
// 💾 Backup / Restore System
// ==========================
function backupData() {
    const allData = {
        adminPass: localStorage.getItem("adminPass"),
        timestamp: new Date().toLocaleString(),
    };

    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "admin_backup.json";
    link.click();

    alert("✅ Backup file downloaded successfully!");
}

function restoreData() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";

    input.onchange = function (event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const data = JSON.parse(e.target.result);
                if (data.adminPass) {
                    localStorage.setItem("adminPass", data.adminPass);
                    alert("✅ Backup restored successfully!");
                } else {
                    alert("⚠️ Invalid backup file!");
                }
            } catch (err) {
                alert("❌ Error reading backup file!");
                console.error(err);
            }
        };
        reader.readAsText(file);
    };

    input.click();
}

// ==========================
// 📢 Telegram Bot Control
// ==========================
async function sendTestTelegram() {
    if (!TELEGRAM_CONFIG?.BOT_TOKEN || !TELEGRAM_CONFIG?.CHAT_ID) {
        alert("⚠️ Telegram configuration missing in config.js");
        return;
    }

    const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.BOT_TOKEN}/sendMessage`;
    const payload = {
        chat_id: TELEGRAM_CONFIG.CHAT_ID,
        text: "🧪 Test message from Admin Panel – Telegram integration working!",
        parse_mode: "HTML",
    };

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            alert("✅ Test message sent successfully!");
        } else {
            alert("⚠️ Failed to send Telegram message!");
        }
    } catch (err) {
        console.error(err);
        alert("❌ Network error while sending message!");
    }
}

// ==========================
// ⚙️ UI Shortcuts (can be called from HTML buttons)
// ==========================
window.AdminPanel = {
    changePassword: changeAdminPassword,
    backup: backupData,
    restore: restoreData,
    testTelegram: sendTestTelegram,
};
