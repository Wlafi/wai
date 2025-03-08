const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Подключаем CORS и JSON-парсер
app.use(cors());
app.use(express.json());

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ Подключено к MongoDB"))
.catch(err => console.log("❌ Ошибка подключения:", err));

// Создаем модель пользователя
const User = mongoose.model("User", new mongoose.Schema({
    username: String,
    password: String
}));

// Главная страница сервера
app.get("/", (req, res) => {
    res.send("🚀 Сервер работает!");
});

// Маршрут для регистрации
app.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;
        const newUser = new User({ username, password });
        await newUser.save();
        res.json({ message: "✅ Пользователь зарегистрирован!" });
    } catch (error) {
        res.status(500).json({ error: "❌ Ошибка сервера" });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`✅ Сервер запущен на порту ${PORT}`);
    console.log("MONGO_URL:", process.env.MONGO_URL);
});
app.get("/users", async (req, res) => {
    const users = await User.find();
    res.json(users);
});
app.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Проверяем, существует ли пользователь
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "❌ Логин уже занят!" });
        }

        // Сохраняем пользователя в базе
        const newUser = new User({ username, email, password });
        await newUser.save();
        res.json({ message: "✅ Пользователь зарегистрирован!" });
    } catch (error) {
        res.status(500).json({ error: "❌ Ошибка сервера" });
    }
});
