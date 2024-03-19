const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const { MongoClient } = require('mongodb');
const cors = require('cors');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cors());

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/CrudDB'; // MongoDB connection URI

let db;
MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to MongoDB');
        db = client.db();
    })
    .catch(err => console.error('Error connecting to MongoDB:', err));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage: storage });

app.get('/msg',(req,res)=>{
  res.status(200).send({
    msg: "api's are working successfully"
  })
})

app.post('/sendMsg', async (req, res) => {
    const formData = req.body;

    try {
        const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();

        const db = client.db();
        const collection1 = db.collection('employees');

        await collection1.insertOne(formData);
        res.send('Data inserted successfully into collection1');

        await client.close();
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/submit_form', upload.fields([
    { name: 'uploadPhoto', maxCount: 1 }, 
    { name: 'uploadCV', maxCount: 1 }, 
    { name: 'uploadCertificates', maxCount: 5 }
  ]), async (req, res) => {
    const formData = req.body;
    const files = req.files;

    try {
        const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();

        const db = client.db();
        const collection2 = db.collection('teacherdatas');

        const data = {
            formData: formData,
            uploadPhoto: files['uploadPhoto'][0].path,
            uploadCertificates: files['uploadCertificates'][0].path,
            uploadCV: files['uploadCV'][0].path
        };

        await collection2.insertOne(data);
        res.send('Data inserted successfully into collection2');

        await client.close();
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/enroll', async (req, res) => {
    const formData = req.body;

    try {
        const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();

        const db = client.db();
        const collection3 = db.collection('enrollforms');

        await collection3.insertOne(formData);
        res.send('Data inserted successfully into collection3');

        await client.close();
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
