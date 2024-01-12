// Class definition for FormValidator
class FormValidator {
    // Constructor function takes formId and optional language parameter
    constructor(formId, language = 'en') {
        // Initialize form property with the HTML form element
        this.form = document.getElementById(formId);

        // Check if the form element exists, log an error if not found
        if (!this.form) {
            console.error(`Form with id "${formId}" not found.`);
            return;
        }

        // Store the language in lowercase
        this.language = language.toLowerCase();

        // Initialize phone number input and set up international telephone input library
        const phoneNumberInput = this.form.querySelector('#phoneNumber');
        if (phoneNumberInput) {
            // Add stylesheet for international telephone input
            this.addStylesheet(
                'https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/css/intlTelInput.css'
            );

            // Initialize international telephone input with specific options
            this.iti = window.intlTelInput(phoneNumberInput, {
                initialCountry: 'auto',
                hiddenInput: 'full_phone',
                geoIpLookup: (callback) => {
                    // Fetch user's country code based on IP address
                    fetch('https://ipapi.co/json')
                        .then((res) => res.json())
                        .then((data) => callback(data.country_code))
                        .catch(() => callback('us'));
                },
                utilsScript:
                    'https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js',
            });
        }

        // Add event listeners for form submission and input changes
        this.form.addEventListener('submit', this.validateForm.bind(this));
        this.form.addEventListener('input', this.handleInput.bind(this));

        // Load messages or use default if not available
        this.messages = window.messages || this.getDefaultMessages();

        // Check if the specified language exists in messages, otherwise use default language
        if (!this.messages[this.language]) {
            console.warn(
                `Language "${language}" not found in messages. Using default language.`
            );
            this.language = 'en';
        }
    }

    // Add a stylesheet to the document head
    addStylesheet(href) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    }

    // Get default error messages
    getDefaultMessages() {
        return {
            en: {
                firstNameError:
                    'First name should be at least 2 characters long',
                lastNameError: 'Last name should be at least 2 characters long',
                emailError: 'Enter a valid email address',
                phoneNumberError: 'Enter a valid phone number',
            },
        };
    }

    // Validate a form field based on the provided validation function
    validateField(fieldName, validationFunction) {
        const input = this.form.querySelector(`#${fieldName}`);
        const error = this.form.querySelector(`#${fieldName}Error`);

        // Check if input and error elements exist
        if (input || error) {
            const value = input.value.trim();
            const isValid = validationFunction(value);

            // Toggle CSS classes based on validation result
            this.toggleInputClass(input, isValid);
            // Update error text based on validation result
            this.updateErrorText(error, isValid, fieldName);

            return isValid;
        }
    }

    // Toggle CSS classes on an input element based on validation result
    toggleInputClass(input, isValid) {
        input.classList.remove(isValid ? 'error' : 'done');
        input.classList.add(isValid ? 'done' : 'error');
    }

    // Update error text on the page based on validation result
    updateErrorText(error, isValid, fieldName) {
        error.textContent = isValid
            ? ''
            : this.messages[this.language][`${fieldName}Error`];
    }

    // Validation function for name (length at least 2 characters)
    validateName(value) {
        return value.length >= 2;
    }

    // Validation function for email (format and regex check)
    validateEmail(value) {
        const emailInput = this.form.querySelector('#email');

        const isValidFormat = emailInput.checkValidity();
        const isValidRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
        return isValidFormat && isValidRegex;
    }

    // Validation function for phone number using the international telephone input library
    validatePhoneNumber() {
        return this.iti.isValidNumber();
    }

    // Validate the entire form
    validateForm(event) {
        // Prevent the default form submission
        event.preventDefault();

        // Define fields to be validated
        const fieldsToValidate = [
            'firstName',
            'lastName',
            'email',
            'phoneNumber',
        ];

        // Check if all fields are valid based on their respective validation functions
        const isValidForm = fieldsToValidate.every((fieldName) => {
            const validationFunction =
                fieldName === 'email'
                    ? this.validateEmail.bind(this)
                    : this[
                          fieldName === 'phoneNumber'
                              ? 'validatePhoneNumber'
                              : 'validateName'
                      ].bind(this);

            const field = this.form.querySelector(`[name="${fieldName}"]`);
            // Validate the field and return the result
            if (field) {
                return this.validateField(fieldName, validationFunction);
            } else {
                // Log a warning if the field is not found
                console.warn(`Field "${fieldName}" not found.`);
                return true;
            }
        });

        // Log errors or submit the form if it's valid
        if (!isValidForm) {
            console.error('Form validation failed.');
        } else {
            console.log('Form submitted successfully.');
            event.target.submit();
        }
    }

    // Handle input events on the form (used for real-time validation)
    handleInput(event) {
        const target = event.target;

        // Check if the event target is an input element
        if (target.tagName === 'INPUT') {
            const fieldName = target.name;
            const validationFunction =
                fieldName === 'email'
                    ? this.validateEmail.bind(this)
                    : this[
                          fieldName === 'phoneNumber'
                              ? 'validatePhoneNumber'
                              : 'validateName'
                      ].bind(this);

            // Validate the specific field based on the input event
            this.validateField(fieldName, validationFunction);
        }
    }
}
