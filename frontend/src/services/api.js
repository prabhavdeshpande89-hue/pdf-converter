import axios from "axios";

export const convertFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(
    "http://localhost:5000/convert",
    formData,
    { responseType: "blob" }
  );

  return response.data;
};