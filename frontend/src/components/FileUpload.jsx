import { useState } from "react";
import "../styles/upload.css";

function FileUpload({ setFile }) {
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");

  const handleChange = (e) => {
    const file = e.target.files[0];

    setFile(file);
    setFileName(file.name);
    setFileSize((file.size / 1024).toFixed(2) + " KB");
  };

  return (
    <div className="upload-container">
      <label className="upload-box">
        <input type="file" onChange={handleChange} hidden />

        {!fileName && (
          <>
            <p>Drag & Drop File</p>
            <span>or click to browse</span>
          </>
        )}

        {fileName && (
          <div className="file-preview">
            <p>📄 {fileName}</p>
            <span>Size: {fileSize}</span>
          </div>
        )}
      </label>
    </div>
  );
}

export default FileUpload;