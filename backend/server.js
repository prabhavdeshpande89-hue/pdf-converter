const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const mammoth = require("mammoth");
const PDFDocument = require("pdfkit");

const app = express();   // IMPORTANT: app must be defined first

app.use(cors());
app.use(express.json());

// create folders if missing
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");
if (!fs.existsSync("converted")) fs.mkdirSync("converted");

const upload = multer({ dest: "uploads/" });

// test route
app.get("/", (req, res) => {
  res.send("PDF Converter API running 🚀");
});

// convert route
app.post("/convert", upload.single("file"), async (req, res) => {

  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  try {
    const filePath = req.file.path;

    const result = await mammoth.extractRawText({ path: filePath });

    const pdfPath = `converted/${req.file.filename}.pdf`;

    const doc = new PDFDocument();
    const stream = fs.createWriteStream(pdfPath);

    doc.pipe(stream);
    doc.text(result.value);
    doc.end();

    stream.on("finish", () => {
      res.download(pdfPath, () => {
        fs.unlinkSync(filePath);
        fs.unlinkSync(pdfPath);
      });
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Conversion failed");
  }

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});