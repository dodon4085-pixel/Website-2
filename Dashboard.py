from flask import Flask, render_template_string, request, redirect, session
import json
import os

# ==========================
# CONFIGURATION
# ==========================
app = Flask(__name__)
app.secret_key = "super_secure_secret_123"  # change if needed
PASSWORD = "admin123"  # your login password
DATA_FILE = "user_data.json"
LOG_FILE = "logs.txt"

# ==========================
# HTML TEMPLATE
# ==========================
HTML_PAGE = """
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Admin Panel</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-dark text-light">
<div class="container mt-5">
    {% if not session.get('logged_in') %}
        <h3 class="text-center">🔐 Admin Login</h3>
        <form method="post" action="/login" class="mt-4">
            <input type="password" name="password" class="form-control mb-3" placeholder="Enter Admin Password">
            <button class="btn btn-primary w-100">Login</button>
        </form>
    {% else %}
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h3>⚙️ Admin Dashboard</h3>
            <a href="/logout" class="btn btn-danger">Logout</a>
        </div>
        <div class="card bg-secondary p-3 mb-3">
            <h5>👥 Registered Users</h5>
            <ul>
                {% for uid, info in users.items() %}
                    <li><b>{{info.first_name}} {{info.last_name}}</b> ({{info.lang}}) — ID: {{uid}}</li>
                {% endfor %}
            </ul>
        </div>
        <div class="card bg-secondary p-3 mb-3">
            <h5>🧾 Logs</h5>
            <pre style="max-height:300px;overflow:auto;">{{logs}}</pre>
        </div>
        <a href="/clear" class="btn btn-warning w-100">🧹 Clear Logs</a>
    {% endif %}
</div>
</body>
</html>
"""

# ==========================
# ROUTES
# ==========================
@app.route("/")
def index():
    if not session.get("logged_in"):
        return render_template_string(HTML_PAGE)
    
    if not os.path.exists(DATA_FILE):
        users = {}
    else:
        with open(DATA_FILE, "r") as f:
            users = json.load(f)
    
    if not os.path.exists(LOG_FILE):
        logs = "No logs yet."
    else:
        with open(LOG_FILE, "r") as f:
            logs = f.read()[-2000:]
    
    # Convert dict to easy render
    user_obj = {}
    for k, v in users.items():
        user_obj[k] = type("obj", (object,), v)
    
    return render_template_string(HTML_PAGE, users=user_obj, logs=logs)

@app.route("/login", methods=["POST"])
def login():
    password = request.form.get("password")
    if password == PASSWORD:
        session["logged_in"] = True
        return redirect("/")
    return "<h3>❌ Wrong Password</h3><a href='/'>Back</a>"

@app.route("/logout")
def logout():
    session.pop("logged_in", None)
    return redirect("/")

@app.route("/clear")
def clear_logs():
    if not session.get("logged_in"):
        return redirect("/")
    open(LOG_FILE, "w").close()
    return redirect("/")

# ==========================
# RUN SERVER
# ==========================
if __name__ == "__main__":
    print("🌐 Web Dashboard running on http://127.0.0.1:5000")
    app.run(debug=False)
