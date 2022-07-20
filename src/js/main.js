$(function () {
	console.log("work");
	// animate background svg
	new Vivus(
		"my-svg",
		{
			type: "delayed",
			duration: 400,
			animTimingFunction: Vivus.EASE,
		},
		function (obj) {
			obj.el.classList.add("finished");
		}
	);
	// animate fields
	const fields = document.querySelectorAll(".animated");
	for (let i = 0; i < fields.length; i++) {
		let field = fields[i];
		setTimeout(() => {
			field.classList.remove("animated");
			field.classList.add("visible");
		}, i * 500);
	}
	// animate send button by click
	const sendButton = document.querySelector("#sendBtn");
	sendButton.addEventListener("click", shakeBtn);
	function shakeBtn(e) {
		e.preventDefault();
		this.classList.add("shake");
	}
	sendButton.addEventListener("animationend", () => {
		sendButton.classList.remove("shake");
	});
});
