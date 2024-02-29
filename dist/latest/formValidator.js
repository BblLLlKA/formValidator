// Define a module that encapsulates the FormValidator class
(function (global, factory) {
    // Check if module loading systems like AMD or CommonJS are available
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        // If no module system is found, attach the FormValidator to the global object
        global.FormValidator = factory();
    }
})(typeof window !== 'undefined' ? window : this, function () {
    // Define the FormValidator class
    class FormValidator {
        // Version number of the FormValidator class
        static version = '2.0.0';

        // Constructor function for creating a FormValidator instance
        constructor(formId = '', options = {}) {
            // Find the HTML form element with the given ID
            this.form = document.getElementById(formId);

            // Throw an error if the form element is not found
            if (!this.form) {
                throw new Error(`Form with id "${formId}" not found.`);
            }

            // Find and store references to various form input elements
            this.fullName = this.form.querySelector('#fullName') || false;
            this.firstName = this.form.querySelector('#firstName') || false;
            this.lastName = this.form.querySelector('#lastName') || false;
            this.email = this.form.querySelector('#email') || false;
            this.phoneNumber = this.form.querySelector('#phoneNumber') || false;

            // Set up international telephone input using options or default options
            if (
                !('iti' in options) ||
                typeof options.iti !== 'object' ||
                Object.keys(options.iti).length === 0
            ) {
                console.warn(
                    `iti "${options.iti}" not found in options. Using default iti options.`
                );
                options.iti = this.getDefaultItiOptions();
            }

            // Event handlers for validation success and validation error
            this.events = {
                validationSuccess: [],
                validationError: [],
            };

            // Set up international telephone input and handle input events
            this.setupPhoneNumberInput(options.iti);

            // Set the language for error messages or use default language (English)
            this.language = options.language
                ? options.language.toLowerCase()
                : 'en';

            // Error messages for different fields in different languages
            this.messages = options.messages || this.getDefaultMessages();

            // Warn if the specified language is not found in messages, use default language
            if (!this.messages[this.language]) {
                console.warn(
                    `Language "${this.language}" not found in messages. Using default messages.`
                );
                this.language = 'en';
                this.messages = this.getDefaultMessages();
            }

            // Generate and insert error message elements next to form input fields
            this.generateErrorMessages();

            // Attach event listeners for form submission and input changes
            this.form.addEventListener('submit', this.validateForm.bind(this));
            this.form.addEventListener('input', this.handleInput.bind(this));
        }

        // Subscribe to validation success or validation error events
        on(eventName, callback) {
            if (typeof callback === 'function' && this.events[eventName]) {
                this.events[eventName].push(callback);
            }
        }

        // Notify subscribers of a specific event with the provided data
        notifySubscribers(eventName, eventData) {
            if (this.events[eventName]) {
                this.events[eventName].forEach((callback) => {
                    callback(eventData);
                });
            }
        }

        // Generate and insert error message elements next to form input fields
        generateErrorMessages() {
            const fields = [
                'fullName',
                'firstName',
                'lastName',
                'email',
                'phoneNumber',
            ];

            fields.forEach((field) => {
                if (this[field]) {
                    const div = document.createElement('div');
                    div.id = `${field}Error`;
                    div.classList.add('field-error');
                    this[field].insertAdjacentElement('afterend', div);
                }
            });
        }

        // Default error messages for different languages
        getDefaultMessages() {
            return {
                en: {
                    fullNameError:
                        'The full name must contain a minimum of two words',
                    firstNameError:
                        'First name should be at least 2 characters long',
                    lastNameError:
                        'Last name should be at least 2 characters long',
                    emailError: 'Enter a valid email address',
                    phoneNumberError: 'Enter a valid phone number',
                },
            };
        }

        // Default options for the international telephone input
        getDefaultItiOptions() {
            return {
                initialCountry: 'auto',
                hiddenInput: 'fullPhone',
                geoIpLookup: (callback) => {
                    // Use IP-based geolocation to determine the initial country
                    fetch('https://ipapi.co/json')
                        .then((res) => res.json())
                        .then((data) => callback(data.country_code))
                        .catch(() => callback('us'));
                },
                // Link to the utility script for international telephone input
                utilsScript:
                    'https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js',
            };
        }

        // Set up the international telephone input for the specified input element
        setupPhoneNumberInput(itiOptions) {
            if (this.phoneNumber) {
                // Add required scripts and stylesheets for international telephone input
                this.addScript(
                    'https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/intlTelInput.min.js'
                );
                this.addStylesheet(
                    'https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/css/intlTelInput.css'
                );
                // Initialize international telephone input after a delay
                setTimeout(() => {
                    this.iti = window.intlTelInput(
                        this.phoneNumber,
                        itiOptions
                    );
                }, 500);
            } else {
                console.warn(`Phone number input: ${this.phoneNumber}`);
            }
        }

        // Add a stylesheet link to the document head
        addStylesheet(href) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            document.head.appendChild(link);
        }

        // Add a script element to the document head
        addScript(link) {
            const script = document.createElement('script');
            script.src = link;
            document.head.appendChild(script);
        }

        // Toggle CSS classes based on validation status for an input element
        toggleInputClass(input, isValid) {
            input.classList.remove(isValid ? 'error' : 'done');
            input.classList.add(isValid ? 'done' : 'error');
        }

        // Update the error text content for a specific error message element
        updateErrorText(error, isValid, fieldId) {
            error.textContent = isValid
                ? ''
                : this.messages[this.language][`${fieldId}Error`];
        }

        // Validate a specific form field using a custom validation function
        validateField(fieldId, validationFunction) {
            const input = this[fieldId];
            const error = this.form.querySelector(`#${fieldId}Error`);

            if (input || error) {
                const value = input.value.trim();
                const isValid = validationFunction(value);
                this.toggleInputClass(input, isValid);
                this.updateErrorText(error, isValid, fieldId);

                return isValid;
            }
        }

        // Custom validation function for full name (at least two words)
        validateFullName() {
            const words = this.fullName.value.split(/\s+/);
            return words.length >= 2;
        }

        // Generic validation function for names (at least two characters)
        validateName(value) {
            return value.length >= 2;
        }

        // Custom validation function for email (using HTML5 validity check and regex)
        validateEmail() {
            const isValidFormat = this.email.checkValidity();
            const isValidRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                this.email.value
            );
            return isValidFormat && isValidRegex;
        }

        // Custom validation function for phone number (using international telephone input)
        validatePhoneNumber() {
            return this.iti.isValidNumber();
        }

        // Validate the entire form by iterating over specified fields
        validateForm(event) {
            // Prevent the default form submission behavior
            event.preventDefault();

            // Array of fields to be validated
            const fieldsToValidate = [
                'fullName',
                'firstName',
                'lastName',
                'email',
                'phoneNumber',
            ];

            // Store the validation results for each field
            this.validationResult = {};

            // Check if each field is valid using its corresponding validation function
            const isValidForm = fieldsToValidate.every((fieldId) => {
                const validationFunction =
                    fieldId === 'email'
                        ? this.validateEmail.bind(this)
                        : fieldId === 'phoneNumber'
                        ? this.validatePhoneNumber.bind(this)
                        : fieldId === 'fullName'
                        ? this.validateFullName.bind(this)
                        : this.validateName.bind(this);

                if (this[fieldId]) {
                    this.validationResult[fieldId] = this.validateField(
                        fieldId,
                        validationFunction
                    );
                } else {
                    console.warn(`Field "${fieldId}" not found.`);
                    this.validationResult[fieldId] = true;
                }
                return this.validationResult[fieldId];
            });

            // If the form is not valid, notify subscribers of validation error and throw an error
            if (!isValidForm) {
                this.notifySubscribers(
                    'validationError',
                    this.validationResult
                );

                throw new Error('Form validation failed.');
            } else {
                // If the form is valid, log success and notify subscribers of validation success
                console.log('The form has been successfully validated.');
                this.notifySubscribers('validationSuccess', this.form);
            }
        }

        // Handle input events to validate individual form fields dynamically
        handleInput(event) {
            const target = event.target;

            // Check if the event target is an input element
            if (target.tagName === 'INPUT') {
                // Get the ID of the input field
                const fieldId = target.id;
                // Choose the validation function based on the type of input field
                const validationFunction =
                    fieldId === 'email'
                        ? this.validateEmail.bind(this)
                        : fieldId === 'phoneNumber'
                        ? this.validatePhoneNumber.bind(this)
                        : fieldId === 'fullName'
                        ? this.validateFullName.bind(this)
                        : this.validateName.bind(this);
                // Validate the individual input field
                this.validateField(fieldId, validationFunction);
            }
        }
    }

    // Return the FormValidator class for external use
    return FormValidator;
});
