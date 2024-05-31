const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const multer = require("multer");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const { v2: cloudinary } = require("cloudinary");
const compression = require("compression");

cloudinary.config({
  cloud_name: "ddkfnfogy",
  api_key: "334596987219218",
  api_secret: "l4qgbRyi6Pjef0Ypu5vi3lvZnk0",
});

// for filtering
const path = require("path");
const fs = require("fs");
const users = require("./db.json");
const blogs = require("./blogs.json");
const { error } = require("console");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(cors());
app.use(compression());

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ storage: storage });

const mongoURI =
"mongodb+srv://vaibhav:vaibhav86964@cluster0.fnunpdl.mongodb.net/formsData?retryWrites=true&w=majority&appName=Cluster0";
  // "mongodb+srv://vaibhavkw2001:1234@cluster0.eqpfhck.mongodb.net/formsData?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("connection successfull");
  })
  .catch((err) => console.log(err));

app.get("/msg", (req, res) => {
  res.status(200).send({
    msg: "APIs are working successfully",
  });
});

app.get("/teachers", (req, res) => {
  fs.readFile(path.join(__dirname, "db.json"), "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      res.status(500).send("Error reading data file");
    } else {
      res.json(JSON.parse(data));
    }
  });
});

// Endpoint to get all teachers
app.get("/filterteachers", (req, res) => {
  fs.readFile(path.join(__dirname, "db.json"), "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      res.status(500).send("Error reading data file");
    }
    // fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, data) => {
    //     if (err) {
    //       console.error('Error reading file:', err);
    //       res.status(500).send('Error reading data file');
    //     } else {
    //       res.json(JSON.parse(data));
    //     }

    try {
      // Parse the JSON data
      const jsonData = JSON.parse(data);

      // Extract query parameters
      const { language, native } = req.query;

      // Filter teachers based on query parameters
      let filteredTeachers = jsonData.teacher;
      if (language) {
        filteredTeachers = filteredTeachers.filter(
          (teacher) => teacher.language.toLowerCase() == language.toLowerCase()
        );
      }
      if (native) {
        filteredTeachers = filteredTeachers.filter(
          (teacher) => teacher.native.toLowerCase() == native.toLowerCase()
        );
      }

      // Send back the filtered teachers
      res.json(filteredTeachers);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      res.status(500).send("Error parsing JSON data");
    }
  });
});


app.post("/api/blogs", async (req, res) => {
  const newBlog = req.body;

  try {
    const client = new MongoClient(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();

    const db = client.db("formsData");
    const collection = db.collection("blogs");

    await collection.insertOne(newBlog);
    res.status(201).json(newBlog);

    await client.close();
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

// GET route to retrieve all blogs
app.get("/api/blogs", async (req, res) => {
  try {
    const client = new MongoClient(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();

    const db = client.db("formsData");
    const collection = db.collection("blogs");

    const blogs = await collection.find({}).toArray();
    res.json(blogs);

    await client.close();
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

// GET route to retrieve a single blog by ID
app.get("/api/blogs/:id", async (req, res) => {
  const blogId = req.params.id;

  try {
    // Validate blogId as a valid ObjectId
    if (!ObjectId.isValid(blogId)) {
      return res.status(400).json({ message: "Invalid blog ID" });
    }

    const client = new MongoClient(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();

    const db = client.db("formsData");
    const collection = db.collection("blogs");

    // Convert blogId to ObjectId
    const blogObjectId = new ObjectId(blogId);

    const blog = await collection.findOne({ _id: blogObjectId });
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);

    await client.close();
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

// PATCH route to update a blog by ID
app.patch("/api/blogs/:id", async (req, res) => {
  const blogId = req.params._id;
  const blogUpdates = req.body;

  try {
    const client = new MongoClient(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();

    const db = client.db("formsData");
    const collection = db.collection("blogs");

    const updatedBlog = await collection.findOneAndUpdate(
      { id: blogId },
      { $set: blogUpdates },
      { returnOriginal: false }
    );

    if (!updatedBlog.value) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(updatedBlog.value);

    await client.close();
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

// DELETE route to delete a blog by ID
app.delete("/api/delete/blogs/:id", async (req, res) => {
  const blogId = req.params._id;

  try {
    const client = new MongoClient(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();

    const db = client.db("formsData");
    const collection = db.collection("blogs");

    const result = await collection.deleteOne({ id: blogId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(204).send("OK");

    await client.close();
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
});



// post for contact
app.post("/sendMsg", async (req, res) => {
  const formData = req.body;

  try {
    const client = new MongoClient(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();

    const db = client.db("formsData");
    const collection1 = db.collection("contactData");

    await collection1.insertOne(formData);
    res.status(200).send("OK");

    await client.close();
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

// app.post("/submit_form", upload.single('uploadPhoto'), async (req, res) => {


//   try {
//     const formData = req.body;
//     const file = req.file;

//     if (!req.file) {
//       return res.status(400).send('No file uploaded.');
//   }
  
//     // Upload file to Cloudinary
//     const cloudinaryUploadResult = await cloudinary.uploader.upload(
//       file.path,
//       { public_id: formData.firstName.replace(/ /g, '_') }
//     );
//     const imageUrl = cloudinaryUploadResult.url;
  
//     console.log("Image URL:", imageUrl);

//     const client = new MongoClient(mongoURI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     await client.connect();
//     const db = client.db("formsData");
//     const collection = db.collection("teacherData");

//     // Prepare data to be saved
//     const dataToSave = {
//       ...formData,
//       uploadPhoto: imageUrl
//     };

//     await collection.insertOne(dataToSave);

//     res.status(200).send("Form data submitted successfully!");
//     await client.close();
//   } catch (err) {
//     console.error("Error:", err);
//     res.status(500).send("Internal Server Error");
//   }
// });

app.post("/submit_form", upload.fields([{ name: 'uploadPhoto', maxCount: 1 }, { name: 'uploadCV', maxCount: 1 }]), async (req, res) => {
  try {
      const formData = req.body;
      const files = req.files;
      let imageUrl, cvUrl;

      if (!files.uploadPhoto || !files.uploadCV) {
          // return res.status(400).send('Both photo and CV files need to be uploaded.');
      }

      // Construct file base name using firstName and lastName
      const baseName = `${formData.firstName}_${formData.lastName}`.replace(/ /g, '_');

      // Upload photo to Cloudinary
      if (files.uploadPhoto) {
          const photo = files.uploadPhoto[0];
          const cloudinaryUploadPhotoResult = await cloudinary.uploader.upload(
              photo.path,
              { public_id: `photo_${baseName}` }
          );
          imageUrl = cloudinaryUploadPhotoResult.url;
      }

      // Upload CV to Cloudinary
      if (files.uploadCV) {
          const cv = files.uploadCV[0];
          const cloudinaryUploadCVResult = await cloudinary.uploader.upload(
              cv.path,
              { resource_type: 'raw', public_id: `cv_${baseName}` }
          );
          cvUrl = cloudinaryUploadCVResult.url;
      }

      const client = new MongoClient(mongoURI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
      });

      await client.connect();
      const db = client.db("formsData");
      const collection = db.collection("teacherData");

      // Prepare data to be saved
      const dataToSave = {
          date: new Date(),
          ...formData,
          uploadPhoto: imageUrl,
          uploadCV: cvUrl,
          remarks: ""
      };

      await collection.insertOne(dataToSave);
      res.status(200).send('OK');
  } catch (err) {
      console.error("Error:", err);
      res.status(500).send("Internal Server Error");
  }
});

// patch api for teachers for updating remarks
app.patch('/api/teachers/:id', async (req, res) => {
  const updates = req.body;
  const id = req.params.id;

  // Check if the provided ID is valid
  if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
      const client = new MongoClient(mongoURI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
      });

      await client.connect();
      const db = client.db("formsData");
      const collection = db.collection("teacherData");

      // Instantiate ObjectId with `new` when using it to construct query
      const result = await collection.updateOne(
          { _id: new ObjectId(id) }, // Correct usage of ObjectId with 'new'
          { $set: updates }
      );

      if (result.matchedCount === 0) {
          return res.status(404).json({ error: 'No matching document found' });
      }

      if (result.modifiedCount === 0) {
          return res.status(200).json({ message: 'No changes made', details: result });
      }

      res.status(200).json({ message: 'Update successful', details: result });
  } catch (err) {
      console.error("Database update error:", err);
      res.status(500).json({ error: 'Could not update the data', details: err.message });
  }
});

// get all api for teachers data 
app.get('/api/teachers', async (req, res) => {
  const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
      await client.connect();
      const db = client.db('formsData'); 
      const collection = db.collection('teacherData'); 

      const teachers = await collection.find({}).toArray(); // Fetch all blog documents
      res.json(teachers);
  } catch (err) {
      console.error('Error:', err);
      res.status(500).send('Internal Server Error');
  } finally {
      await client.close(); 
  }
});


app.post("/enroll", async (req, res) => {
  const formData = req.body;

  try {
    const client = new MongoClient(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();

    const db = client.db("formsData");
    const collection3 = db.collection("quickForm");

    await collection3.insertOne(formData);
    res.status(200).send("OK");
    await client.close();
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/guideForm", async (req, res) => {
  const formData = req.body;

  try {
    const client = new MongoClient(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();

    const db = client.db("formsData");
    const collection4 = db.collection("guideData");

    await collection4.insertOne(formData);
    res.status(200).send("OK");

    await client.close();
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// ---------------------reduce the response time ------------------------
