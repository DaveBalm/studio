
console.log('Content script loaded');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "createNote") {
    console.log("Selected text:", request.selectedText);
    // Here, you might want to open the extension popup or 
    // directly create a note in the background.
    // For simplicity, we'll just log the selected text.
  }
});
