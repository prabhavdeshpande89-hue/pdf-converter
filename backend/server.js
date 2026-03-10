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
  try {

    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    const filePath = req.file.path;
    const pdfPath = `converted/${req.file.filename}.pdf`;

    console.log("File uploaded:", filePath);

    // Extract text from DOCX
    const result = await mammoth.extractRawText({ path: filePath });

    console.log("Extracted text length:", result.value.length);

    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(pdfPath);

    doc.pipe(writeStream);
    doc.fontSize(12).text(result.value || "No text found in document");
    doc.end();

    writeStream.on("finish", () => {
      console.log("PDF created successfully");

      res.download(pdfPath, "converted.pdf", () => {
        fs.unlinkSync(filePath);
        fs.unlinkSync(pdfPath);
      });
    });

    writeStream.on("error", (err) => {
      console.error("Stream error:", err);
      res.status(500).send("Conversion failed");
    });

  } catch (err) {
    console.error("Conversion error:", err);
    res.status(500).send("Conversion failed");
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});