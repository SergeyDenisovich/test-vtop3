$(function () {
	// ====================================== Animate fields when page loaded ================== //
	const fields = document.querySelectorAll(".animated");
	for (let i = 0; i < fields.length; i++) {
		let field = fields[i];
		setTimeout(() => {
			field.classList.remove("animated");
			field.classList.add("visible");
		}, i * 500);
	}
	// ====================================== /Animate fields when page loaded ================= //
});
