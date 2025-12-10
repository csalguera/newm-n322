import { storage } from "../firebase/firebaseConfig";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadString,
} from "firebase/storage";

const generateImagePath = (userId) => {
  const ts = Date.now();
  const rand = Math.random().toString(36).slice(2, 8);
  return `users/${userId}/contacts/${ts}-${rand}.jpg`;
};

const isHttpUrl = (uri = "") =>
  uri.startsWith("http://") || uri.startsWith("https://");
const isDataUrl = (uri = "") => uri.startsWith("data:");

const extractMimeFromDataUrl = (uri = "") => {
  const match = uri.match(/^data:([^;,]+)[;,]/);
  return match ? match[1] : "image/jpeg";
};

export const uploadContactImage = async (uri, userId) => {
  if (!uri || !userId) return null;
  if (isHttpUrl(uri)) return uri; // already uploaded

  const path = generateImagePath(userId);
  const storageRef = ref(storage, path);

  // If data URL, use uploadString; otherwise fetch as blob
  try {
    if (isDataUrl(uri)) {
      const contentType = extractMimeFromDataUrl(uri);
      await uploadString(storageRef, uri, "data_url", { contentType });
    } else {
      const response = await fetch(uri);
      const blob = await response.blob();
      const contentType = blob.type || "image/jpeg";
      await uploadBytes(storageRef, blob, { contentType });
    }

    return getDownloadURL(storageRef);
  } catch (err) {
    console.error("uploadContactImage failed", err);
    throw err;
  }
};
