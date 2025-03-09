const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // Лучше хранить в .env

app.use(cors());
app.use(express.json());

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URL)

.then(() => console.log("✅ Подключено к MongoDB"))
.catch(err => console.log("❌ Ошибка подключения:", err));

// Модель пользователя
const User = mongoose.model("User", new mongoose.Schema({
    username: String,
    email: String,
    password: String
}));

// Главная страница сервера
app.get("/", (req, res) => {
    res.send("🚀 Сервер работает!");
});

// Регистрация пользователя
app.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Проверяем, существует ли пользователь
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "❌ Email уже зарегистрирован!" });
        }

        // Хешируем пароль
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Сохраняем пользователя в базе
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        
        res.json({ message: "✅ Пользователь зарегистрирован!" });
    } catch (error) {
        res.status(500).json({ error: "❌ Ошибка сервера" });
    }
});

// Авторизация пользователя
app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Ищем пользователя в базе
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "❌ Неверный email или пароль" });
        }

        // Проверяем пароль
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "❌ Неверный email или пароль" });
        }

        // Генерируем JWT
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "✅ Вход успешен!", token });
    } catch (error) {
        res.status(500).json({ error: "❌ Ошибка сервера" });
    }
});

// Получение всех пользователей (только для теста)
app.get("/api/users", async (req, res) => {
    const users = await User.find().select("-password"); // Исключаем пароли из ответа
    res.json(users);
});
app.listen(PORT, () => {
    console.log(`✅ Сервер запущен на порту ${PORT}`);

    console.log("\n📌 Зарегистрированные маршруты:");
    app._router.stack.forEach((middleware) => {
        if (middleware.route) { 
            console.log(`➡ ${Object.keys(middleware.route.methods).join(", ").toUpperCase()} ${middleware.route.path}`);
        }
    });
});
