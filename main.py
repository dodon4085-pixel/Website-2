import telebot
from telebot import types
import datetime
import json
import os

# =============================
# CONFIGURATION
# =============================
BOT_TOKEN = "8589527391:AAEF3bCeKx0J-y9dc0KHeJCOolzHLJjYVo4"
ADMIN_ID = 7681046220
bot = telebot.TeleBot(BOT_TOKEN)

# =============================
# DATABASE FILE
# =============================
DATA_FILE = "user_data.json"
if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, "w") as f:
        json.dump({}, f)

# =============================
# HELPER FUNCTIONS
# =============================
def load_users():
    with open(DATA_FILE, "r") as f:
        return json.load(f)

def save_users(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=4)

def log_action(user_id, action):
    with open("logs.txt", "a") as f:
        f.write(f"{datetime.datetime.now()} - {user_id}: {action}\n")

# =============================
# START COMMAND
# =============================
@bot.message_handler(commands=["start"])
def start(message):
    user_id = str(message.from_user.id)
    users = load_users()
    
    if user_id not in users:
        users[user_id] = {
            "first_name": message.from_user.first_name,
            "last_name": message.from_user.last_name,
            "lang": message.from_user.language_code,
            "joined": str(datetime.datetime.now())
        }
        save_users(users)
        log_action(user_id, "Joined bot")

    bot.reply_to(message, "✅ Welcome to the Advanced Admin Panel Bot!")

# =============================
# ADMIN PANEL
# =============================
@bot.message_handler(commands=["admin"])
def admin_panel(message):
    if message.from_user.id != ADMIN_ID:
        return bot.reply_to(message, "⛔ Access Denied!")

    markup = types.InlineKeyboardMarkup()
    markup.add(types.InlineKeyboardButton("📋 User List", callback_data="user_list"))
    markup.add(types.InlineKeyboardButton("🗑 Clear Logs", callback_data="clear_logs"))
    markup.add(types.InlineKeyboardButton("📄 View Logs", callback_data="view_logs"))
    markup.add(types.InlineKeyboardButton("🚪 Exit", callback_data="exit_panel"))
    bot.send_message(message.chat.id, "⚙️ *Admin Panel Opened*", parse_mode="Markdown", reply_markup=markup)

# =============================
# CALLBACK HANDLERS
# =============================
@bot.callback_query_handler(func=lambda call: True)
def callback_query(call):
    if call.message.chat.id != ADMIN_ID:
        return bot.answer_callback_query(call.id, "⛔ Access Denied!")

    if call.data == "user_list":
        users = load_users()
        msg = "👥 *Registered Users:*\n\n"
        for uid, info in users.items():
            msg += f"🆔 `{uid}` - {info['first_name']} {info['last_name']} ({info['lang']})\n"
        bot.send_message(call.message.chat.id, msg, parse_mode="Markdown")

    elif call.data == "view_logs":
        if not os.path.exists("logs.txt"):
            bot.send_message(call.message.chat.id, "📄 No logs available.")
        else:
            with open("logs.txt", "r") as f:
                logs = f.read()[-2000:]  # last 2000 chars
            bot.send_message(call.message.chat.id, f"🧾 *Recent Logs:*\n\n```{logs}```", parse_mode="Markdown")

    elif call.data == "clear_logs":
        open("logs.txt", "w").close()
        bot.send_message(call.message.chat.id, "🧹 Logs cleared successfully!")

    elif call.data == "exit_panel":
        bot.send_message(call.message.chat.id, "👋 Exiting Admin Panel.")

# =============================
# SECURITY (BLOCK OTHERS)
# =============================
@bot.message_handler(func=lambda m: True)
def default_response(message):
    if message.from_user.id != ADMIN_ID:
        log_action(message.from_user.id, f"Attempted unauthorized command: {message.text}")
        bot.reply_to(message, "⚠️ You are not authorized to use this command.")

# =============================
# START BOT
# =============================
print("🤖 Bot is running...")
bot.infinity_polling()
