fetch('https://wai-1.onrender.com/api/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        email: 'user@example.com',
        password: '123456'
    })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Ошибка:', error));

async function registerUser() {
    const username = "testUser";
    const password = "123456";

    const response = await fetch("https://wai-1.onrender.com/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    console.log(data);
}

registerUser();
