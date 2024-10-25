import CryptoJS from "crypto-js";
import { destroyCookie, parseCookies, setCookie } from "nookies";

export const encryptData = (data) => {
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    process.env.NEXT_PUBLIC_ENCRYPTION_KEY
  ).toString();
  return encryptedData;
};

export const decryptData = (encryptedData) => {
  if (!encryptedData) return null;

  const bytes = CryptoJS.AES.decrypt(
    encryptedData,
    process.env.NEXT_PUBLIC_ENCRYPTION_KEY
  );
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedData);
};

export const createCookie = (key, value, options = {}) => {
  const defaultOptions = {
    path: "/", // Specify a common path for all cookies
  };
  const encryptedValue = encryptData(value);
  setCookie(null, key, encryptedValue, { ...defaultOptions, ...options });
};

export const getCookie = (key) => {
  const cookies = parseCookies(); // Retrieve all cookies
  const encryptedValue = cookies[key]; // Get the encrypted cookie value
  if (!encryptedValue) return null; // Return null if the cookie is not found

  const decryptedValue = decryptData(encryptedValue); // Decrypt the cookie value
  return decryptedValue; // Return the decrypted value
};

export const clearCookie = (key, options = {}) => {
  const defaultOptions = {
    path: "/", // Specify a common path for all cookies
  };
  destroyCookie(null, key, { ...defaultOptions, ...options });
};

export const formateString = (text) => {
  if (text) {
    // Check if the text is a code block
    const isCodeBlock = text.startsWith("```") && text.endsWith("```");

    let plainText;
    if (isCodeBlock) {
      // For code blocks, remove the backticks and language identifier
      plainText = text
        .replace(/^```[\w-]*\n/, "") // Remove opening ```language
        .replace(/```$/, "") // Remove closing ```
        .trim();
    } else {
      // For regular text, remove Markdown formatting
      plainText = text
        .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
        .replace(/\*(.*?)\*/g, "$1") // Remove italic
        .replace(/\[(.*?)\]$$.*?$$/g, "$1") // Remove links
        .replace(/^#+\s/gm, "") // Remove heading markers
        .replace(/^[-*+]\s/gm, "") // Remove list item markers
        .trim();
    }

    return plainText;
  }
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};
