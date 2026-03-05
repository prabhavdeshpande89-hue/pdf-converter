const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const libre = require("libreoffice-convert");

const app = express();
app.use(cors());

// create folders if they don't exist
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

if (!fs.existsSync("converted")) {
  fs.mkdirSync("converted");
}

const upload = multer({ dest: "uploads/" });

// test route
app.get("/", (req, res) => {
  res.send("PDF Converter API running");
});

// conversion route
app.post("/convert", upload.single("file"), (req, res) => {

  const filePath = req.file.path;
  const outputPath = `converted/${req.file.filename}.pdf`;

  const file = fs.readFileSync(filePath);

  libre.convert(file, ".pdf", undefined, (err, done) => {

    if (err) {
      console.error(err);
      return res.status(500).send("Conversion failed");
    }

    fs.writeFileSync(outputPath, done);

    res.download(outputPath, () => {
      fs.unlinkSync(filePath);
      fs.unlinkSync(outputPath);
    });

  });

});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});