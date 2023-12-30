const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'photos/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/photos', (req, res) => {
    const photosDirectory = path.join(__dirname, 'photos');

    fs.readdir(photosDirectory, (err, files) => {
        if (err) {
            return res.status(500).send('Error reading photos directory');
        }

        const photoDataArray = files.map(file => {
            const imagePath = path.join(photosDirectory, file);
            const imageData = fs.readFileSync(imagePath, 'base64');
            return {
                name: file,
                data: imageData,
            };
        });

        res.json(photoDataArray);
    });
});

app.post('/api/upload', upload.single('photo'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
});

app.delete('/api/photos/:name', (req, res) => {
    const photoName = req.params.name;
    const photoPath = path.join(__dirname, 'photos', photoName);
  
    fs.unlink(photoPath, (err) => {
      if (err) {
        console.error('Error deleting photo:', err);
        return res.status(500).send('Error deleting photo');
      }
  
      res.status(200).send('Photo deleted successfully');
    });
  });

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

