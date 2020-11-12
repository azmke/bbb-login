chrome.runtime.onInstalled.addListener(function() {
	chrome.storage.sync.set({"rooms": []});
	chrome.storage.local.set({"pending": []});
	chrome.storage.local.set({"attempts": []});
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if(changeInfo.status === "complete" && tab.active) {
		chrome.tabs.executeScript(
			tabId,
			{file: "logic.js"}
		);
	}
});