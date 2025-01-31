const express = require('express');
const path = require('path');
const fileupload = require('express-fileupload');
const bodyParser = require('body-parser');
const cloudinary = require('cloudinary').v2;
require('dotenv').config(); // Load environment variables

let initial_path = path.join(__dirname, "public");

const app = express();
app.use(express.static(initial_path));
app.use(fileupload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));
app.use(bodyParser.urlencoded({ extended: true }));

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


app.get('/', (req, res) => {
    res.sendFile(path.join(initial_path, "login.html"));
})

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Validate username and password here
    if (username === 'admin' && password === 'password') {
        res.redirect('/home');
    } else {
        res.send('Invalid username or password');
    }
})

app.get('/home', (req, res) => {
    res.sendFile(path.join(initial_path, "home.html"));
})

app.get('/editor', (req, res) => {
    res.sendFile(path.join(initial_path, "editor.html"));
})

// upload link
app.post('/upload', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    let file = req.files.image;

    // Upload image to Cloudinary
    cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({ url: result.secure_url });
    });
})

app.get("/:blog", (req, res) => {
    res.sendFile(path.join(initial_path, "blog.html"));
})

app.use((req, res) => {
    res.json("404");
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})