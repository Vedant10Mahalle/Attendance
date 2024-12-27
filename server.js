// server.js (Backend)

const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect('mongodb://localhost/attendanceDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));

// Models
const Student = mongoose.model("Student", new mongoose.Schema({
  studentId: String,
  name: String,
  fingerprint: String,  // Store fingerprint data or just a reference for simplicity
}));

const Attendance = mongoose.model("Attendance", new mongoose.Schema({
  studentId: String,
  date: Date,
  status: String,
}));

// Storage for file uploads (CSV/PDF)
const upload = multer({ dest: "uploads/" });

// Register Fingerprint (simulated)
app.post("/api/register-fingerprint", async (req, res) => {
  const { studentId, name, fingerprint } = req.body;
  
  const newStudent = new Student({ studentId, name, fingerprint });
  await newStudent.save();
  
  res.status(201).json({ message: "Fingerprint registered successfully!" });
});

// Mark Attendance (simulated)
app.post("/api/mark-attendance", async (req, res) => {
  const { studentId, status } = req.body;
  
  const newAttendance = new Attendance({
    studentId,
    date: new Date(),
    status,
  });

  await newAttendance.save();
  
  res.status(200).json({ message: "Attendance marked successfully!" });
});

// Teacher Upload Data (CSV/PDF)
app.post("/api/upload-data", upload.single('file'), (req, res) => {
  const filePath = req.file.path;
  const fileExtension = req.file.originalname.split('.').pop();

  // Parse the file: Handle CSV/PDF parsing here (e.g., using csv-parser or pdf-parse)
  if (fileExtension === "csv") {
    // CSV parsing logic
    const parseCSV = require("csv-parser");
    const results = [];
    fs.createReadStream(filePath)
      .pipe(parseCSV())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        console.log("CSV data:", results);
        // Store data to DB as needed
        res.json({ message: "CSV Data uploaded successfully!" });
      });
  } else if (fileExtension === "pdf") {
    const pdfParse = require("pdf-parse");
    const pdfBuffer = fs.readFileSync(filePath);

    pdfParse(pdfBuffer).then((pdfData) => {
      console.log("PDF Text:", pdfData.text);
      // Store data to DB as needed
      res.json({ message: "PDF Data uploaded successfully!" });
    });
  } else {
    res.status(400).json({ message: "Invalid file format!" });
  }
});

// Collect Attendance Data
app.get("/api/attendance-data", async (req, res) => {
  const attendanceRecords = await Attendance.find();
  res.json(attendanceRecords);
});

// Server Setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
