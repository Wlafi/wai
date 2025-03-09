async function login() {
    const email = document.getElementById("login").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorDiv = document.getElementById("error-message");
    errorDiv.innerHTML = "";

    if (!email || !password) {
        errorDiv.innerHTML = "Заполните все поля!";
        return;
    }

    try {
        const response = await fetch("https://wai-1.onrender.com/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            alert("Вход успешен!");
            window.location.href = "idebar.html";
        } else {
            errorDiv.innerHTML = data.message || "Ошибка входа";
        }
    } catch (error) {
        errorDiv.innerHTML = "Ошибка сервера";
    }
}

document.querySelector("form").addEventListener("submit", function(event) {
    event.preventDefault();
    login();
});
