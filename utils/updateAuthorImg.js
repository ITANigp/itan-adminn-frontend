import { api } from "./auth/authorApi";
import CryptoJS from "crypto-js";

async function computeChecksum(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      const wordArray = CryptoJS.lib.WordArray.create(reader.result);
      const base64 = CryptoJS.enc.Base64.stringify(CryptoJS.MD5(wordArray));
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
}

export default async function directUploadFile(file) {
  const checksum = await computeChecksum(file);

  const response = await api.post("/direct_uploads", {
    blob: {
      filename: file.name,
      byte_size: file.size,
      checksum,
      content_type: file.type,
    },
  });

  const { signed_id, direct_upload } = response.data;

  const uploadResponse = await fetch(direct_upload.url, {
    method: "PUT",
    headers: {
      ...direct_upload.headers,
      "Content-Length": file.size.toString(),
      "Content-MD5": checksum,
    },
    body: file,
  });

  if (!uploadResponse.ok) {
    const errorText = await uploadResponse.text();
    throw new Error(
      `S3 upload failed: ${uploadResponse.status} - ${errorText}`
    );
  }

  return signed_id;
}
