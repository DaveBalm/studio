
console.log('Background script started');

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "createNote",
    title: "Create Note from Selection",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "createNote") {
    chrome.tabs.sendMessage(tab.id, {
      action: "createNote",
      selectedText: info.selectionText
    });
  }
});
