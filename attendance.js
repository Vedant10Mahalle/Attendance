const express = require("express");
const Attendance = require("../models/Attendance");

const router = express.Router();

// View Attendance (For a specific student)
router.get("/view/:studentId", async (req, res) => {
  const { studentId } = req.params;

  try {
    const records = await Attendance.find({ studentId }).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
});

module.exports = router;
