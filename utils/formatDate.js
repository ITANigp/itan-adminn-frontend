// const isoDate = "2025-05-22T19:27:40.827Z";

export default function formatDate (input) {
    const date = new Date(input);

    // Example: "May 22, 2025"
    const formatted = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return formatted
}
