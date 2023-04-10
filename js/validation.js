"use strict";

const form = document.getElementById('contact-form');
const formInputFields = [
	form.name, 
	form.email, 
	form.phone, 
	form.message, 
	form.checkbox
];
const toastError = document.querySelector('.toast-error');
const toastSuccess = document.querySelector('.toast-success');
const toastErrorNotification = new bootstrap.Toast(toastError);
const toastSuccessNotification = new bootstrap.Toast(toastSuccess);

let flags = {
	isNameValid: false, 
	isEmailValid: false, 
	isPhoneValid: false, 
	isMessageValid: false, 
	isCheckboxValid: false
};

// A function to check if field is empty. 
// If it is, remove ivalid class (for aesthetic purposes)
// If not, continue with the normal validation 
const removeInvalidClasses = currInputField => {
	currInputField = currInputField.target.value.trim() === '' 
		? currInputField.target.parentElement.classList.remove('invalid') 
		: validateField(currInputField);
};

const regexCheck = (regexCondition, field) => {
	if (regexCondition.test(field.value)) {
		field.parentElement.classList.remove('invalid');
		return true;
	} else {
		field.parentElement.classList.add('invalid');
		return false;
	}
};

// A function the receives a field as parameter and validates its value using appropriate regex
const validateField = field => {
	if (field === form.name) {
		const regexName = /^([a-zA-Zά-ωΑ-ώ]+\s)*[a-zA-Zά-ωΑ-ώ]{4,20}$/;
		flags.isNameValid = regexCheck(regexName, field);
	} else if (field === form.email) {
		const regexEmail = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,3})$/;
		flags.isEmailValid = regexCheck(regexEmail, field);
	} else if (field === form.phone) {
		const regexPhone = /^([+][3][0])?([6]{1})([9]{1})([0-9]{8})$/;
		flags.isPhoneValid = regexCheck(regexPhone, field);
	} else if (field === form.message) {
		const regexMessage = /^([a-zA-Zά-ωΑ-ώ0-9,.?!;-]+\s)*[a-zA-Zά-ωΑ-ώ0-9,.?!;-]{1,500}$/m;
		flags.isMessageValid = regexCheck(regexMessage, field);
	} else if (field === form.checkbox) {
		if (form.checkbox.checked) {
			form.checkbox.parentElement.classList.remove('invalid');
			flags.isCheckboxValid = true;
		} else {
			form.checkbox.parentElement.classList.add('invalid');
			flags.isCheckboxValid = false;
		}
	}
};

// A function that checks the fields for errors and logs related information to the user
const reportFieldErrors = () => {
	const errorCountEl = document.querySelector('.error-count');
	const errorReportEl = document.querySelector('.errors');
	errorReportEl.textContent = '';
	let errorCount = 0;
	
	if (!flags.isNameValid) {
		errorReportEl.innerHTML += `<i class="icofont-exclamation-circle"></i> "Ονοματεπώνυμο" <br/>`;
		errorCount++;
	}
	if (!flags.isEmailValid) {
		errorReportEl.innerHTML += `<i class="icofont-exclamation-circle"></i> "Email Επικοινωνίας" <br/>`;
		errorCount++;
	}
	if (!flags.isPhoneValid) {
		errorReportEl.innerHTML += `<i class="icofont-exclamation-circle"></i> "Αριθμός Κινητού" <br/>`;
		errorCount++;
	}
	if (!flags.isMessageValid) {
		errorReportEl.innerHTML += `<i class="icofont-exclamation-circle"></i> "Το μήνυμά σας..." <br/>`;
		errorCount++;
	}
	if (!flags.isCheckboxValid) {
		errorReportEl.innerHTML += `<i class="icofont-exclamation-circle"></i> "Απαιτείται αποδοχή" <br/>`;
		errorCount++;
	}
	
	errorCountEl.textContent = errorCount;
};

// Get the current date helper function
function getCurrentDate() {
	const date = new Date();
	const day = date.getDate().toString().padStart(2, '0');
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const year = date.getFullYear().toString();
	
	return `${day}/${month}/${year}`;
}


// SUBMIT FORM EVENT
form.addEventListener('submit', e => {
	e.preventDefault();

	if (Object.values(flags).every(flag => flag === true)) {
		(async () => {
			const response = await fetch(form.action, {
				method: form.method,
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					Όνομα: form.name.value,
					Email: form.email.value,
					Τηλέφωνο: form.phone.value,
					Μήνυμα: form.message.value,
					Προϊον: form.selection.value === 'Επιλέξτε προϊόν' ? 'Καμία επιλογή' : form.selection.value,
					['Ημερομηνία Αποστολής']: getCurrentDate()
				})
			})

			return response.json()
		})()
		
		for (const key in flags) {
			flags[key] = false;
		}

		toastSuccessNotification.show();
		form.reset();
	} else {
		formInputFields.forEach(inputField => validateField(inputField));
		reportFieldErrors();
		toastErrorNotification.show();
	}
});

// Adding the event listeners to the input fields
for (const inputField of formInputFields) {
	if (inputField.classList.contains('form-control')) {
		inputField.addEventListener('keyup', e => validateField(e.target));
		inputField.addEventListener('blur', e => removeInvalidClasses(e));
	} else {
		inputField.addEventListener('click', e => validateField(e.target));
	}
}