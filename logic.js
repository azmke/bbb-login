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

		let title = document.getElementsByTagName("h1")[0];
		if (title) {

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
				if (nameInput && nameInput.form) {

					chrome.storage.local.get("pending", function(data) {
						let pending = data.pending.filter(p => p.url === window.location.href)[0];
						if (pending) {

							nameInput.form.onsubmit = function(e) {
								let newRoom = {
									title: title.innerText,
									url: window.location.href,
									code: pending ? pending.code : "",
									name: nameInput.value,
									microphone: false
								};

								chrome.storage.sync.set({"rooms": [newRoom, ...rooms]});
								chrome.storage.local.set({"pending": data.pending.filter(p => p.url !== window.location.href)});
							}

						}
					});

				}

			}

		}

	}
});