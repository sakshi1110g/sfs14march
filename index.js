const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const con = mysql.createConnection({
  host: "sql12.freesqldatabase.com",
  user: "sql12820085",
  password: "hFQ2m6bD8z",
  database: "sql12820085"
});


// FILE STORAGE SETTINGS
const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }

});

const upload = multer({ storage });


// STATIC FOLDER FOR IMAGES
app.use("/uploads", express.static("uploads"));


// SAVE STUDENT
app.post("/ss", upload.single("file"), (req, res) => {

  let sql = "insert into student values(?, ?, ?, ?)";
  let data = [
    req.body.rno,
    req.body.name,
    req.body.marks,
    req.file.filename
  ];

  con.query(sql, data, (error, response) => {

    if (error)
      res.send(error);
    else
      res.send(response);

  });

});


// GET STUDENTS
app.get("/gs", (req, res) => {

  let sql = "select * from student";

  con.query(sql, (error, response) => {

    if (error)
      res.send(error);
    else
      res.send(response);

  });

});


// DELETE STUDENT
app.delete("/ds", (req, res) => {

  let sql = "delete from student where rno = ?";
  let data = [req.body.rno];

  fs.unlink("./uploads/" + req.body.file, (err) => {
    if (err)
      console.log(err);
  });

  con.query(sql, data, (error, response) => {

    if (error)
      res.send(error);
    else
      res.send(response);

  });

});


// SERVER
app.listen(9000, () => {
  console.log("Ready to serve @ 9000");
});
