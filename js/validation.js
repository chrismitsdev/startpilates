const form = document.getElementById('contact-form');
const formInputFields = [form.name, form.email, form.phone, form.message];
const toastElement = document.querySelector('.toast');
const toastNotification = new bootstrap.Toast(toastElement);

let isNameValid = false;
let isEmailValid = false;
let isPhoneValid = false;
let isMessageValid = false;

// A function to check if field is empty. 
// If it is, remove ivalid class (for aesthetic purposes)
// If not, continue with the normal validation 
const removeInvalidClasses = currInputField => {
	currInputField = currInputField.target.value.trim() === '' 
		? currInputField.target.parentElement.classList.remove('invalid') 
		: validateField(currInputField);
};

const regexCheck = (regexCondition, field) => {
	if(regexCondition.test(field.value)) {
		field.parentElement.classList.remove('invalid');
		return true;
	} else {
		field.parentElement.classList.add('invalid');
		return false;
	}
};

// A function the receives a field as parameter and validates its value using appropriate regex
const validateField = field => {
	if(field === form.name) {
		const regexName = /^([a-zA-Zά-ωΑ-ώ]+\s)*[a-zA-Zά-ωΑ-ώ]{4,20}$/;
		isNameValid = regexCheck(regexName, field);
	} else if(field === form.email) {
		const regexEmail = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{3})$/;
		isEmailValid = regexCheck(regexEmail, field);
	} else if(field === form.phone) {
		const regexPhone = /^([+][3][0])?([6]{1})([9]{1})([0-9]{8})$/;
		isPhoneValid = regexCheck(regexPhone, field);
	} else if(field === form.message) {
		const regexMessage = /^([a-zA-Zά-ωΑ-ώ,.?]+\s)*[a-zA-Zά-ωΑ-ώ,.?]{1,500}$/m;
		isMessageValid = regexCheck(regexMessage, field);
	}
};

// A simple function that creates the current time and injects it in the toast notification
const currentTime = () => {
	const timeElement = document.querySelector('.time');
	const date = new Date();
	const hh = date.getHours();
	const mm = date.getMinutes();
	const ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
	const time = `${hh}:${mm}:${ss}`;
	timeElement.textContent = time;
	
	const liveTime = setTimeout(function(){ currentTime() }, 1000);
};

const reportFieldErrors = () => {
	const flags = {isNameValid, isEmailValid, isPhoneValid, isMessageValid};
	const errorCountEl = document.querySelector('.error-count');
	const errorReportEl = document.querySelector('.errors');
	errorReportEl.textContent = '';
	let errorCount = 0;
	
	if(!flags.isNameValid) {
		errorReportEl.innerHTML += `<i class="icofont-exclamation-circle"></i> "Ονοματεπώνυμο" <br>`;
		errorCount++;
	}
	if(!flags.isEmailValid) {
		errorReportEl.innerHTML += `<i class="icofont-exclamation-circle"></i> "Email Επικοινωνίας" <br>`;
		errorCount++;
	}
	if(!flags.isPhoneValid) {
		errorReportEl.innerHTML += `<i class="icofont-exclamation-circle"></i> "Αριθμός Κινητού" <br>`;
		errorCount++;
	}
	if(!flags.isMessageValid) {
		errorReportEl.innerHTML += `<i class="icofont-exclamation-circle"></i> "Το μήνυμά σας..." <br>`;
		errorCount++;
	}
	
	errorCountEl.textContent = errorCount;
};

// SUBMIT FORM EVENT
form.addEventListener('submit', e => {
	e.preventDefault();
	
	console.log(isNameValid, isEmailValid, isPhoneValid, isMessageValid);
	
	if(isNameValid && isEmailValid && isPhoneValid && isMessageValid) {
		console.log('✔️ Form ready to be submitted!');
	} else {
		console.log('🔴 Something went wrong...');
		formInputFields.forEach(inputField => validateField(inputField));
		reportFieldErrors();
		toastNotification.show();
	}
});


// Adding the event listeners to the input fields
for (const inputField of formInputFields) {
	inputField.addEventListener('keyup', e => validateField(e.target));
	inputField.addEventListener('blur', e => removeInvalidClasses(e));
}

// Init timer of the toast notification
currentTime();