// Retrieve and parse the stored data
// export const storedAuthorInfo = JSON.parse(localStorage.getItem("authorInfo"));
// export const storedAuthorInfo = authorInfo ? JSON.parse(authorInfo) : null;

let storedAuthorInfo = null;

if (typeof window !== "undefined") {

try {
  const authorInfo = localStorage.getItem("authorInfo");
//   storedAuthorInfo = JSON.parse(localStorage.getItem("authorInfo") || "{}");
  storedAuthorInfo = authorInfo ? JSON.parse(authorInfo) : null;
} catch (error) {
  console.error("Error parsing authorInfo from localStorage:", error);
  localStorage.removeItem("authorInfo"); // Clear corrupted data
}

}

console.log("Stored Author Info:", storedAuthorInfo);

export { storedAuthorInfo };
