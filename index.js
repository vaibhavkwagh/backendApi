// const express = require("express");
// const app = express();
// const bodyParser = require("body-parser");
// const multer = require("multer");
// const { MongoClient, ObjectId } = require("mongodb");
// const cors = require("cors");
// const { default: mongoose } = require("mongoose");
// const { v2: cloudinary } = require("cloudinary");
// const compression = require("compression");

// cloudinary.config({
//   cloud_name: "ddkfnfogy",
//   api_key: "334596987219218",
//   api_secret: "l4qgbRyi6Pjef0Ypu5vi3lvZnk0",
// });

// // for filtering
// const path = require("path");
// const fs = require("fs");
// const users = require("./db.json");
// const blogs = require("./blogs.json");
// const { error } = require("console");

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(express.static("public"));
// app.use(cors());
// app.use(compression());

// const storage = multer.diskStorage({
//   filename: function (req, file, cb) {
//       cb(null, Date.now() + '-' + file.originalname)
//   }
// });

// const upload = multer({ storage: storage });

// const mongoURI =
//   "mongodb+srv://vaibhavkw2001:1234@cluster0.eqpfhck.mongodb.net/formsData?retryWrites=true&w=majority&appName=Cluster0";
// mongoose
//   .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     console.log("connection successfull");
//   })
//   .catch((err) => console.log(err));

// app.get("/msg", (req, res) => {
//   res.status(200).send({
//     msg: "APIs are working successfully",
//   });
// });

// app.get("/teachers", (req, res) => {
//   fs.readFile(path.join(__dirname, "db.json"), "utf8", (err, data) => {
//     if (err) {
//       console.error("Error reading file:", err);
//       res.status(500).send("Error reading data file");
//     } else {
//       res.json(JSON.parse(data));
//     }
//   });
// });

// // Endpoint to get all teachers
// app.get("/filterteachers", (req, res) => {
//   fs.readFile(path.join(__dirname, "db.json"), "utf8", (err, data) => {
//     if (err) {
//       console.error("Error reading file:", err);
//       res.status(500).send("Error reading data file");
//     }
//     // fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, data) => {
//     //     if (err) {
//     //       console.error('Error reading file:', err);
//     //       res.status(500).send('Error reading data file');
//     //     } else {
//     //       res.json(JSON.parse(data));
//     //     }

//     try {
//       // Parse the JSON data
//       const jsonData = JSON.parse(data);

//       // Extract query parameters
//       const { language, native } = req.query;

//       // Filter teachers based on query parameters
//       let filteredTeachers = jsonData.teacher;
//       if (language) {
//         filteredTeachers = filteredTeachers.filter(
//           (teacher) => teacher.language.toLowerCase() == language.toLowerCase()
//         );
//       }
//       if (native) {
//         filteredTeachers = filteredTeachers.filter(
//           (teacher) => teacher.native.toLowerCase() == native.toLowerCase()
//         );
//       }

//       // Send back the filtered teachers
//       res.json(filteredTeachers);
//     } catch (parseError) {
//       console.error("Error parsing JSON:", parseError);
//       res.status(500).send("Error parsing JSON data");
//     }
//   });
// });

// // get api for blogs
// app.get("/api/blogs", async (req, res) => {
//   fs.readFile(path.join(__dirname, "blogs.json"), "utf8", (err, data) => {
//     if (err) {
//       console.error("Error reading file:", err);
//       res.status(500).send("Error reading data file");
//     } else {
//       res.json(JSON.parse(data));
//     }
//   });
// });

// // get api for single user
// app.get("/api/blogs/:id", (req, res) => {
//   const blogId = Number(req.params.id);
//   const blog = blogs.blogs.find((blog) => blog.id === blogId);
//   if (blog) {
//     res.json(blog);
//   } else {
//     res.status(404).json({ message: "Blog not found" });
//   }
// });

// app.post("/sendMsg", async (req, res) => {
//   const formData = req.body;

//   try {
//     const client = new MongoClient(mongoURI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     await client.connect();

//     const db = client.db("formsData");
//     const collection1 = db.collection("contactData");

//     await collection1.insertOne(formData);
//     res.status(200).send("OK");

//     await client.close();
//   } catch (err) {
//     console.error("Error:", err);
//     res.status(500).send("Internal Server Error");
//   }
// });

// // app.post("/submit_form", upload.single('uploadPhoto'), async (req, res) => {


// //   try {
// //     const formData = req.body;
// //     const file = req.file;

// //     if (!req.file) {
// //       return res.status(400).send('No file uploaded.');
// //   }
  
// //     // Upload file to Cloudinary
// //     const cloudinaryUploadResult = await cloudinary.uploader.upload(
// //       file.path,
// //       { public_id: formData.firstName.replace(/ /g, '_') }
// //     );
// //     const imageUrl = cloudinaryUploadResult.url;
  
// //     console.log("Image URL:", imageUrl);

// //     const client = new MongoClient(mongoURI, {
// //       useNewUrlParser: true,
// //       useUnifiedTopology: true,
// //     });

// //     await client.connect();
// //     const db = client.db("formsData");
// //     const collection = db.collection("teacherData");

// //     // Prepare data to be saved
// //     const dataToSave = {
// //       ...formData,
// //       uploadPhoto: imageUrl
// //     };

// //     await collection.insertOne(dataToSave);

// //     res.status(200).send("Form data submitted successfully!");
// //     await client.close();
// //   } catch (err) {
// //     console.error("Error:", err);
// //     res.status(500).send("Internal Server Error");
// //   }
// // });

// app.post("/submit_form", upload.fields([{ name: 'uploadPhoto', maxCount: 1 }, { name: 'uploadCV', maxCount: 1 }]), async (req, res) => {
//   try {
//       const formData = req.body;
//       const files = req.files;
//       let imageUrl, cvUrl;

//       if (!files.uploadPhoto || !files.uploadCV) {
//           // return res.status(400).send('Both photo and CV files need to be uploaded.');
//       }

//       // Construct file base name using firstName and lastName
//       const baseName = `${formData.firstName}_${formData.lastName}`.replace(/ /g, '_');

//       // Upload photo to Cloudinary
//       if (files.uploadPhoto) {
//           const photo = files.uploadPhoto[0];
//           const cloudinaryUploadPhotoResult = await cloudinary.uploader.upload(
//               photo.path,
//               { public_id: `photo_${baseName}` }
//           );
//           imageUrl = cloudinaryUploadPhotoResult.url;
//       }

//       // Upload CV to Cloudinary
//       if (files.uploadCV) {
//           const cv = files.uploadCV[0];
//           const cloudinaryUploadCVResult = await cloudinary.uploader.upload(
//               cv.path,
//               { resource_type: 'raw', public_id: `cv_${baseName}` }
//           );
//           cvUrl = cloudinaryUploadCVResult.url;
//       }

//       const client = new MongoClient(mongoURI, {
//           useNewUrlParser: true,
//           useUnifiedTopology: true,
//       });

//       await client.connect();
//       const db = client.db("formsData");
//       const collection = db.collection("teacherData");

//       // Prepare data to be saved
//       const dataToSave = {
//           date: new Date(),
//           ...formData,
//           uploadPhoto: imageUrl,
//           uploadCV: cvUrl,
//           remarks: ""
//       };

//       await collection.insertOne(dataToSave);
//       res.status(200).send('OK');
//   } catch (err) {
//       console.error("Error:", err);
//       res.status(500).send("Internal Server Error");
//   }
// });

// // patch api for teachers for updating remarks
// app.patch('/api/teachers/:id', async (req, res) => {
//   const updates = req.body;
//   const id = req.params.id;

//   // Check if the provided ID is valid
//   if (!ObjectId.isValid(id)) {
//       return res.status(400).json({ error: 'Invalid ID format' });
//   }

//   try {
//       const client = new MongoClient(mongoURI, {
//           useNewUrlParser: true,
//           useUnifiedTopology: true,
//       });

//       await client.connect();
//       const db = client.db("formsData");
//       const collection = db.collection("teacherData");

//       // Instantiate ObjectId with `new` when using it to construct query
//       const result = await collection.updateOne(
//           { _id: new ObjectId(id) }, // Correct usage of ObjectId with 'new'
//           { $set: updates }
//       );

//       if (result.matchedCount === 0) {
//           return res.status(404).json({ error: 'No matching document found' });
//       }

//       if (result.modifiedCount === 0) {
//           return res.status(200).json({ message: 'No changes made', details: result });
//       }

//       res.status(200).json({ message: 'Update successful', details: result });
//   } catch (err) {
//       console.error("Database update error:", err);
//       res.status(500).json({ error: 'Could not update the data', details: err.message });
//   }
// });

// // get all api for teachers data 
// app.get('/api/teachers', async (req, res) => {
//   const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

//   try {
//       await client.connect();
//       const db = client.db('formsData'); 
//       const collection = db.collection('teacherData'); 

//       const teachers = await collection.find({}).toArray(); // Fetch all blog documents
//       res.json(teachers);
//   } catch (err) {
//       console.error('Error:', err);
//       res.status(500).send('Internal Server Error');
//   } finally {
//       await client.close(); 
//   }
// });


// app.post("/enroll", async (req, res) => {
//   const formData = req.body;

//   try {
//     const client = new MongoClient(mongoURI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     await client.connect();

//     const db = client.db("formsData");
//     const collection3 = db.collection("quickForm");

//     await collection3.insertOne(formData);
//     res.status(200).send("OK");
//     await client.close();
//   } catch (err) {
//     console.error("Error:", err);
//     res.status(500).send("Internal Server Error");
//   }
// });

// app.post("/guideForm", async (req, res) => {
//   const formData = req.body;

//   try {
//     const client = new MongoClient(mongoURI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     await client.connect();

//     const db = client.db("formsData");
//     const collection4 = db.collection("guideData");

//     await collection4.insertOne(formData);
//     res.status(200).send("OK");

//     await client.close();
//   } catch (err) {
//     console.error("Error:", err);
//     res.status(500).send("Internal Server Error");
//   }
// });

// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });


// ---------------------reduce the response time ------------------------
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const multer = require("multer");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
const mongoose = require("mongoose");
const { v2: cloudinary } = require("cloudinary");
const compression = require("compression");
const fs = require("fs");
const path = require("path");

// Initialize Cloudinary
cloudinary.config({
  cloud_name: "ddkfnfogy",
  api_key: "334596987219218",
  api_secret: "l4qgbRyi6Pjef0Ypu5vi3lvZnk0",
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(cors());
app.use(compression());

// Database connection URI
const mongoURI =
  "mongodb+srv://vaibhavkw2001:1234@cluster0.eqpfhck.mongodb.net/formsData?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Create a MongoDB connection pool
const client = new MongoClient(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Store data from JSON files in memory
let teacherData;
let blogData;

// Read JSON files
fs.readFile(path.join(__dirname, "db.json"), "utf8", (err, data) => {
  if (err) {
    console.error("Error reading teacher data file:", err);
  } else {
    teacherData = JSON.parse(data).teacher;
  }
});

fs.readFile(path.join(__dirname, "blogs.json"), "utf8", (err, data) => {
  if (err) {
    console.error("Error reading blog data file:", err);
  } else {
    blogData = JSON.parse(data).blogs;
  }
});

// Endpoint to check if APIs are working
app.get("/msg", (req, res) => {
  res.status(200).send({
    msg: "APIs are working successfully",
  });
});

// Endpoint to get all teachers
app.get("/teachers", (req, res) => {
  if (!teacherData) {
    return res.status(500).send("Teacher data not available");
  }
  res.json(teacherData);
});

// Endpoint to filter teachers
app.get("/filterteachers", (req, res) => {
  if (!teacherData) {
    return res.status(500).send("Teacher data not available");
  }

  try {
    let filteredTeachers = [...teacherData];

    const { language, native } = req.query;

    if (language) {
      filteredTeachers = filteredTeachers.filter(
        (teacher) => teacher.language.toLowerCase() === language.toLowerCase()
      );
    }
    if (native) {
      filteredTeachers = filteredTeachers.filter(
        (teacher) => teacher.native.toLowerCase() === native.toLowerCase()
      );
    }

    res.json(filteredTeachers);
  } catch (err) {
    console.error("Error filtering teachers:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint to get all blogs
app.get("/api/blogs", (req, res) => {
  if (!blogData) {
    return res.status(500).send("Blog data not available");
  }
  res.json(blogData);
});

// Endpoint to get a single blog by ID
app.get("/api/blogs/:id", (req, res) => {
  const blogId = Number(req.params.id);
  const blog = blogData.find((blog) => blog.id === blogId);
  if (blog) {
    res.json(blog);
  } else {
    res.status(404).json({ message: "Blog not found" });
  }
});

// Endpoint to submit a form
app.post("/submit_form", upload.fields([{ name: 'uploadPhoto', maxCount: 1 }, { name: 'uploadCV', maxCount: 1 }]), async (req, res) => {
  try {
      // Process form data and file uploads here

      res.status(200).send('Form data submitted successfully!');
  } catch (err) {
      console.error("Error submitting form:", err);
      res.status(500).send("Internal Server Error");
  }
});

// Endpoint to update teacher remarks
app.patch("/api/teachers/:id", async (req, res) => {
  try {
    // Update teacher remarks here

    res.status(200).json({ message: "Update successful" });
  } catch (err) {
    console.error("Error updating teacher remarks:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint to enroll
app.post("/enroll", async (req, res) => {
  try {
    // Process enrollment here

    res.status(200).send("Enrollment successful");
  } catch (err) {
    console.error("Error enrolling:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint to submit guide form
app.post("/guideForm", async (req, res) => {
  try {
    // Process guide form submission here

    res.status(200).send("Guide form submitted successfully");
  } catch (err) {
    console.error("Error submitting guide form:", err);
    res.status(500).send("Internal Server Error");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

