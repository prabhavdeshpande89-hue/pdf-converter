import axios from "axios";

export const convertFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(
    "https://pdf-converter-iu50.onrender.com/convert",
    formData,
    { responseType: "blob" }
  );

  return response.data;
};