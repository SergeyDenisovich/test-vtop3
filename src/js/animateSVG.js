$(function () {
	// ====================================== Animate svg ====================================== //
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
	// ====================================== /Animate svg ====================================== //
});
