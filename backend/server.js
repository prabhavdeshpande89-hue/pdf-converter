const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const libre = require("libreoffice-convert");

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });

app.post("/convert", upload.single("file"), (req, res) => {
  const filePath = req.file.path;
  const outputPath = `converted/${req.file.filename}.pdf`;

  const file = fs.readFileSync(filePath);

  libre.convert(file, ".pdf", undefined, (err, done) => {
    if (err) {
      return res.status(500).send("Conversion failed");
    }

    fs.writeFileSync(outputPath, done);
    res.download(outputPath);
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});