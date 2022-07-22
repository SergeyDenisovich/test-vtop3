$(function () {
	console.log("work");

	// ====================================== Form handling ====================================== //
	const initialformDataState = {
		firstName: "",
		lastName: "",
		nationality: "american",
		email: "",
		dateOfBirth: "21-december-1995",
		gender: "male",
		password: "",
		confirmPassword: "",
	};

	let formData = { ...initialformDataState };
	const form = document.querySelector(".form");
	const sendBtn = form.querySelector("#sendBtn");
	form.addEventListener("input", handleFormInput);
	form.addEventListener("submit", submitForm);

	// validate form fields & save
	function handleFormInput(e) {
		// check firstName field
		if (e.target.name === "firstName") {
			form[e.target.name].nextElementSibling?.remove();

			if (!e.target.value.match(/^[a-zA-Z]{4,}/)) {
				const error = generateError(`${e.target.name} at least 4 letters!`);
				formData[e.target.name] = e.target.value;
				form[e.target.name].after(error);
				form[e.target.name].style.color = "#FF2828";
			} else {
				form[e.target.name].style.color = "";
				// if value pass validate - save it on object (formData)
				formData[e.target.name] = e.target.value;
			}
		}

		// check lastName field
		if (e.target.name === "lastName") {
			form[e.target.name].nextElementSibling?.remove();

			if (!e.target.value.match(/^[a-zA-Z]{4,}/)) {
				const error = generateError(`${e.target.name} at least 4 letters!`);
				formData[e.target.name] = e.target.value;
				form[e.target.name].after(error);
				form[e.target.name].style.color = "#FF2828";
			} else {
				form[e.target.name].style.color = "";
				formData[e.target.name] = e.target.value;
			}
		}

		// check email field
		if (e.target.name === "email") {
			form[e.target.name].nextElementSibling?.remove();

			if (
				!e.target.value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
			) {
				form.querySelector(".check-icon").classList.remove("visible");
				const error = generateError(`Incorrect ${e.target.name}!`);
				formData[e.target.name] = e.target.value;
				form[e.target.name].after(error);
				form[e.target.name].style.color = "#FF2828";
			} else {
				form[e.target.name].style.color = "";
				form.querySelector(".check-icon").classList.add("visible");
				formData[e.target.name] = e.target.value;
			}
		}

		// check password field
		if (e.target.name === "password") {
			form[e.target.name].nextElementSibling?.remove();

			if (!e.target.value.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)) {
				const error = generateError(`Incorrect ${e.target.name}!`);
				formData[e.target.name] = e.target.value;
				form[e.target.name].after(error);
			} else {
				formData[e.target.name] = e.target.value;
			}
		}

		// check confirmPassword field
		if (e.target.name === "confirmPassword") {
			form[e.target.name].nextElementSibling?.remove();

			if (e.target.value !== formData.password) {
				const error = generateError("Password's do not match!");
				formData[e.target.name] = e.target.value;
				form[e.target.name].after(error);
			} else {
				formData[e.target.name] = e.target.value;
			}
		}

		// check gender's fields {
		if (e.target.name === "gender") {
			formData[e.target.name] = e.target.value;
		}

		// check date of nationality
		if (e.target.name === "nationality") {
			formData[e.target.name] = e.target.value;
		}

		// check dateOfBirth --- Date
		if (e.target.name === "date") {
			formData.dateOfBirth = writeDateOfBirth(e.target.value);
		}

		// check dateOfBirth --- Month
		if (e.target.name === "month") {
			formData.dateOfBirth = writeDateOfBirth(null, e.target.value, null);
		}

		// check dateOfBirth --- Year
		if (e.target.name === "year") {
			formData.dateOfBirth = writeDateOfBirth(null, null, e.target.value);
		}
	}

	// utils function to rewrite dateOfBirth string
	function writeDateOfBirth(date, month, year) {
		const strArr = formData.dateOfBirth.split("-"); // ['12', 'december', '1995']

		if (date) strArr[0] = date;
		if (month) strArr[1] = month;
		if (year) strArr[2] = year;

		return strArr.join("-");
	}

	// submit form
	async function submitForm(e) {
		e.preventDefault();

		// find all errors messages and delete them
		delErrorsField();

		const isFormReadyToSend = isFormReady();

		if (isFormReadyToSend) {
			// =============================================
			// ================ prepared data to send
			// const formDataToSend = new FormData();
			// Object.keys(formData).forEach((field) => {
			// 	formDataToSend.append(field, formData[field]);
			// });

			// ...if we would have server to proccess form data
			// fetch("https://...", {
			// 	method: "POST",
			// 	headers: {
			// 		"Content-Type": "form/multipart",
			// 	},
			// 	body: formDataToSend,
			// })
			// 	.then((resp) => resp.json())
			// 	.then((data) => console.log(data));
			// /=============================================

			const response = await fetch(
				// "https://jsonplaceholder.typicode.com/posts/1"
				"http://localhost:3000/server-ok.json"
			);
			const responseData = await response.json();
			const data = await responseData;

			let sendedFormData = formData;
			console.log("Данные формы: ", sendedFormData);

			alert("Регистрация прошла успешно!");

			form.querySelector(".check-icon").classList.remove("visible");
			form.reset();
			formData = { ...initialformDataState };
		}

		if (!isFormReadyToSend) {
			sendBtn.classList.add("shake");
		}
	}

	// check if form is ready to send
	function isFormReady() {
		const errors = [];
		for (let key in formData) {
			if (formData[key] === "") {
				const error = generateError(`${key} cannot be blank!`);
				errors.push(key);
				form[key].after(error);
			}
		}

		if (formData.password !== formData.confirmPassword) {
			const error = generateError("Password's do not match!");
			form.querySelector("#confirmPass").after(error);
			errors.push("password");
		}

		if (errors.length) return false;

		if (!errors.length) return true;
	}

	// create an error element and text in it
	const generateError = function (text) {
		let error = document.createElement("span");
		error.className = "error-field";
		error.textContent = text;
		return error;
	};

	// delete "shake" class at button after animation
	sendBtn.addEventListener("animationend", () => {
		sendBtn.classList.remove("shake");
	});

	// delete errors span with error text
	function delErrorsField() {
		const errors = form.querySelectorAll(".error-field");
		errors.forEach((errorField) => {
			errorField.remove();
		});
	}
	// ====================================== /Form handling =================================== //

	// ====================================== Enable send button after 5 sec ==================== //
	enableSendButton();

	function enableSendButton() {
		setTimeout(() => {
			sendBtn.disabled = false;
		}, 5500);
	}
	// ====================================== /Enable send button after 5 sec ==================== //
});
