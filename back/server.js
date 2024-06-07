const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static(path.join(__dirname, '../front/public')));

const imagesFilePath = path.join(__dirname, 'data', 'images.json');

// Leer imágenes desde el archivo JSON
let images = [];
if (fs.existsSync(imagesFilePath)) {
    images = JSON.parse(fs.readFileSync(imagesFilePath));
}

app.get('/images', (req, res) => {
    res.json(images);
});

app.post('/images', (req, res) => {
    const image = req.body.image;
    images.push(image);
    fs.writeFileSync(imagesFilePath, JSON.stringify(images, null, 2)); // Guardar imágenes en el archivo JSON
    res.status(201).json(image);
});

app.delete('/images/:index', (req, res) => {
    const index = parseInt(req.params.index);
    if (index >= 0 && index < images.length) {
        images.splice(index, 1);
        fs.writeFileSync(imagesFilePath, JSON.stringify(images, null, 2)); // Guardar imágenes en el archivo JSON
        res.status(204).send();
    } else {
        res.status(404).send();
    }
});

// Ruta para servir index.html en la raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../front/public', 'index.html'));
});

// Ruta para servir index-admin.html en /admin
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../front/public', 'index-admin.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});