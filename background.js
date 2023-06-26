// Add an event listener for the runtime message
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "changeZoom") {
    // Change the zoom level of the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      const tabUrl = activeTab.url;
      
      if (tabUrl.startsWith("https://open.spotify.com/")) {
        const zoomFactor = message.zoomFactor || 1.0; // Default zoom factor is 1.0
        chrome.tabs.setZoom(activeTab.id, zoomFactor);
      }
    });
  }
});
