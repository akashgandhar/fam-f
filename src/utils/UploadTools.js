import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import { storage } from "../firebase";

export const UploadFileToStorage = async (file, path) => {
  try {
    var url = "";
    console.log("Uploading file", file);
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file)
      .then((snapshot) => {
        return getDownloadURL(storageRef);
      })
      .then(async (downloadUrl) => {
        url = downloadUrl;
      });

    return {
      url: url,
      status: "success",
    };
  } catch (error) {
    console.log("Error uploading file", error.message);
    return {
      error: error.message,
      status: "error",
    };
  }
};

export const getImageFromStorage = async (path) => {
  try {
    const storageRef = ref(storage, path);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.log("Error getting image", error.message);
    return null;
  }
}
