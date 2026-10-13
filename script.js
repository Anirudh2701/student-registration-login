
const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const welcome = document.getElementById("welcome");
const message = document.getElementById("message");

// Display registration or login form
function showForm(type) {
    registerForm.hidden = type !== "register";
    loginForm.hidden = type !== "login";
    welcome.hidden = true;
    message.textContent = "";
    message.className = "";
}

// Display success or error messages
function showMessage(text, type) {
    message.textContent = text;
    message.className = type;
}

// Get registered users from localStorage
function getUsers() {
    try {
        const users = JSON.parse(
            localStorage.getItem("students") || "[]"
        );

        return Array.isArray(users) ? users : [];
    } catch {
        return [];
    }
}

// Register a new student
registerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email")
        .value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const confirmPassword =
        document.getElementById("confirmPassword").value;

    if (!name) {
        showMessage("Please enter your full name.", "error");
        return;
    }

    if (password.length < 6) {
        showMessage(
            "Password must contain at least 6 characters.",
            "error"
        );
        return;
    }

    if (password !== confirmPassword) {
        showMessage("Passwords do not match!", "error");
        return;
    }

    const users = getUsers();

    const existingUser = users.find(
        user => user.email === email
    );

    if (existingUser) {
        showMessage(
            "This email is already registered!",
            "error"
        );
        return;
    }

    const newUser = {
        name: name,
        email: email,
        password: password
    };

    users.push(newUser);

    try {
        localStorage.setItem("students", JSON.stringify(users));

        showMessage(
            "Registration successful! Please log in.",
            "success"
        );

        registerForm.reset();
        showForm("login");

        showMessage(
            "Registration successful! Please log in.",
            "success"
        );
    } catch {
        showMessage(
            "Unable to save details. Check browser storage.",
            "error"
        );
    }
});

// Login by validating stored credentials
loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail")
        .value.trim().toLowerCase();
    const password =
        document.getElementById("loginPassword").value;

    const users = getUsers();

    const user = users.find(
        user =>
            user.email === email &&
            user.password === password
    );

    if (user) {
        registerForm.hidden = true;
        loginForm.hidden = true;
        welcome.hidden = false;

        message.textContent = "";
        message.className = "";

        document.getElementById("welcomeMessage").textContent =
            "Welcome, " + user.name + "!";

        loginForm.reset();
    } else {
        showMessage(
            "Invalid email or password. Please try again.",
            "error"
        );
    }
});

// Logout
function logout() {
    welcome.hidden = true;
    loginForm.hidden = false;
    registerForm.hidden = true;

    document.getElementById("loginPassword").value = "";
    showMessage("You have logged out successfully.", "success");
}
