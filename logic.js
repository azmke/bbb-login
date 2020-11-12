chrome.storage.sync.get("rooms", function(data) {
	let rooms = data.rooms;
	let room = rooms.filter(r => r.url === window.location.href)[0];
	if (room) {
		console.log("BBB room credentials:", room);

		let codeInput = document.getElementById("room_access_code");

		chrome.storage.local.get("attempts", function(data) {

			if (codeInput) {

				// entered code was invalid
				if (data.attempts.filter(a => a.url === window.location.href)[0]) {

					console.error("Invalid code. Delete room.");

					chrome.storage.sync.set({"rooms": rooms.filter(r => r.url !== window.location.href)});

					codeInput.form.onsubmit = function(e) {
						chrome.storage.local.get("pending", function(data) {
							chrome.storage.local.set({"pending": [...data.pending.filter(p => p.url !== window.location.href), {
								url: window.location.href,
								code: codeInput.value
							}]});
						});
					}

				} else {

					console.log("Insert code");

					codeInput.value = room.code;
					codeInput.form.onsubmit = function(e) {
						chrome.storage.local.set({"attempts": [...data.attempts, {
							url: window.location.href,
							code: room.code
						}]});
					}
					codeInput.form.submit();

				}

			} else {

				console.log("Insert name");

				let nameInput = document.querySelector("[id$=join_name]");
				nameInput.value = room.name;
				nameInput.form.onsubmit = function(e) {

					chrome.storage.sync.set({"rooms": rooms.map(r => r.url === window.location.href ? {...r, name: nameInput.value } : r)})

					chrome.storage.local.set({"attempts": data.attempts.filter(a => a.url !== window.location.href)});
				}
				//nameInput.form.submit();

			}

		});

	} else {

		let description = document.querySelector('meta[property="og:description"]');
		if (description) {

			let isBBB = /You have been invited to join (.*?) using BigBlueButton/.exec(description.content);
			if (isBBB) {
				console.log("This is a BBB instance.");

				let codeInput = document.getElementById("room_access_code");
				if (codeInput) {

					codeInput.form.onsubmit = function(e) {
						chrome.storage.local.get("pending", function(data) {
							chrome.storage.local.set({"pending": [...data.pending.filter(p => p.url !== window.location.href), {
								url: window.location.href,
								code: codeInput.value
							}]});
						});
					}

				} else {

					let nameInput = document.querySelector("[id$=join_name]");
					let joinButton = document.getElementById("room-join");

					chrome.storage.local.get("pending", function(data) {
						let pending = data.pending.filter(p => p.url === window.location.href)[0];
						joinButton.onclick = function(e) {
							let newRoom = {
								title: isBBB[1],
								url: window.location.href,
								code: pending ? pending.code : "",
								name: nameInput.value,
								microphone: false
							};

							chrome.storage.sync.set({"rooms": [newRoom, ...rooms]});
							chrome.storage.local.set({"pending": data.pending.filter(p => p.url !== window.location.href)});
						}
				
					});

				}

			}
		}

	}
});