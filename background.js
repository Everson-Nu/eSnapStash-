// background.js
chrome.runtime.onInstalled.addListener(() => {
  console.log("Shopping List extension installed.");
});

chrome.runtime.onStartup.addListener(() => {
  console.log("Shopping List extension started.");
});

// Placeholder for additional background functionalities
