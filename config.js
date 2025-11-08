// ==============================
// 🤖 Telegram Configuration (Demo)
// Dinhata Buzzer Hub Admin Panel
// ==============================

const TELEGRAM_CONFIG = {
    BOT_TOKEN: "8589527391:AAEF3bCeKx0J-y9dc0KHeJCOolzHLJjYVo4", // demo token
    CHAT_ID: "7681046220", // demo chat id
    ADMIN_NAME: "Biswajit Roy",
    LANG: "en",
};

// Export for Node-like environments (optional)
if (typeof module !== "undefined" && module.exports) {
    module.exports = TELEGRAM_CONFIG;
}

console.log("✅ Telegram config loaded successfully");
