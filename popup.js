let rooms = document.getElementById("rooms");

chrome.storage.sync.get("rooms", function(data) {
	data.rooms.forEach(function(room) {

		let li = document.createElement("li");

		let div = document.createElement("div");
		div.className = "wrapper";

		let info = document.createElement("div");
		info.className = "info";

		let title = document.createElement("h3");
		title.innerHTML = room.title;
		info.appendChild(title);

		let url = document.createElement("a");
		url.setAttribute("href", "#");
		url.innerHTML = room.url;
		info.appendChild(url);

		let code = document.createElement("div");
		code.innerHTML = room.code;
		info.appendChild(code);

		div.appendChild(info);

		li.onclick = function(e) {
			chrome.tabs.create({ url: room.url });
		}

		let icon = document.createElement("div");
		icon.className = "icon";

		let button = document.createElement("div");
		button.className = "button";
		button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>';
		button.onclick = function(e) {
			e.stopPropagation();
			
			chrome.storage.sync.get("rooms", function(data) {
				chrome.storage.sync.set({"rooms": data.rooms.filter(r => r.url !== room.url)}, function() {
					li.remove();
				});
			});
		}

		icon.appendChild(button);

		div.appendChild(icon);

		li.appendChild(div);

		let hr = document.createElement("hr");
		li.appendChild(hr);

		rooms.appendChild(li);

	})
});