const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const { default: mongoose } = require('mongoose');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cors());

const mongoURI = 'mongodb+srv://vaibhavkw2001:1234@cluster0.eqpfhck.mongodb.net/formsData?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoURI,{ useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log('connection successfull')
}).catch((err)=> console.log(err));


// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/')
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + '-' + file.originalname)
//     }
// });

// const upload = multer({ storage: storage });

app.get('/msg', (req, res) => {
    res.status(200).send({
        msg: "APIs are working successfully"
    })
});

app.post('/sendMsg', async (req, res) => {
    const formData = req.body;

    try {
        const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();

        const db = client.db('formsData'); 
        const collection1 = db.collection('contactData');

        await collection1.insertOne(formData);
        // res.send('Data inserted successfully into collection1');
        res.send({ message: 'Data sent successfully!' });
        
        await client.close();
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
});
// , upload.fields([
//     { name: 'uploadPhoto', maxCount: 1 },
//     { name: 'uploadCV', maxCount: 1 },
//     { name: 'uploadCertificates', maxCount: 1 }
// ])
app.post('/submit_form', async (req, res) => {
    const formData = req.body;
    // const files = req.files;

    try {
        const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();

        const db = client.db('formsData'); 
        const collection2 = db.collection('teacherData');

        const data = {
            formData: formData,
            // uploadPhoto: files['uploadPhoto'][0].path,
            // uploadCertificates: files['uploadCertificates'][0].path,
            // uploadCV: files['uploadCV'][0].path
        };
        console.log(data);
        await collection2.insertOne(formData);
        res.send('Data inserted successfully into collection2');
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

        const db = client.db('formsData'); 
        const collection3 = db.collection('quickForm');

        await collection3.insertOne(formData);
        res.send('Data inserted successfully into collection3');
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
