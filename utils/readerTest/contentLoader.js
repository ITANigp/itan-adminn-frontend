import { tokenManager } from "./tokenManager";

export async function loadBookContent(
  bookId,
  {
    showError,
    loadPdfViewer,
    loadEpubReader,
    loadGenericReader,
    initializeAudioPlayer,
  }
) {
  let token = tokenManager.getToken(bookId);

  if (!token) {
    token = await tokenManager.refreshToken(bookId);
    if (!token) {
      showError("Reading session expired. Please try again.");
      return;
    }
  }

  try {
    const response = await fetch(`/books/${bookId}/content`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const contentData = await response.json();

    if (contentData.format?.includes("pdf")) {
      loadPdfViewer(contentData.url);
    } else if (contentData.format?.includes("epub")) {
      loadEpubReader(contentData.url);
    } else if (contentData.audio_files?.length > 0) {
      initializeAudioPlayer(contentData.audio_files, contentData.duration);
    } else {
      loadGenericReader(contentData.url, contentData.format);
    }
  } catch (error) {
    console.error("Error loading book content:", error);
    showError("Failed to load book content");
  }
}
