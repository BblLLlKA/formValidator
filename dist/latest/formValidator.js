(function (global, factory) {
    // Check for module definition type and define the factory accordingly
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        global.FormValidator = factory();
    }
})(typeof window !== 'undefined' ? window : this, function () {
    class FormValidator {
        static version = '2.0.1';

        constructor(formId = '', options = {}) {
            // Get the form element by ID
            this.form = document.getElementById(formId);
            if (!this.form) {
                throw new Error(`Form with id "${formId}" not found.`);
            }

            // Define the fields to be validated
            this.fields = [
                'fullName',
                'firstName',
                'lastName',
                'email',
                'phoneNumber',
            ];
            this.fields.forEach(
                (field) =>
                    (this[field] = this.form.querySelector(`#${field}`) || null)
            );

            // Event system for validation callbacks
            this.events = { validationSuccess: [], validationError: [] };
            this.language = options.language
                ? options.language.toLowerCase()
                : 'en';
            this.messages = options.messages || this.getDefaultMessages();
            if (!this.messages[this.language]) {
                console.warn(
                    `Language "${this.language}" not found in messages. Using default messages.`
                );
                this.language = 'en';
                this.messages = this.getDefaultMessages();
            }

            this.generateErrorMessages();
            this.setupPhoneNumberInput(
                options.iti || this.getDefaultItiOptions()
            );

            // Add event listeners for form submission and input validation
            this.form.addEventListener('submit', this.validateForm.bind(this));
            this.form.addEventListener('input', this.handleInput.bind(this));
        }

        // Subscribe to validation events
        on(eventName, callback) {
            if (typeof callback === 'function' && this.events[eventName]) {
                this.events[eventName].push(callback);
            }
        }

        // Notify event subscribers
        notifySubscribers(eventName, eventData) {
            if (this.events[eventName]) {
                this.events[eventName].forEach((callback) =>
                    callback(eventData)
                );
            }
        }

        // Generate error message containers for each field
        generateErrorMessages() {
            this.fields.forEach((field) => {
                if (this[field]) {
                    const div = document.createElement('div');
                    div.id = `${field}Error`;
                    div.classList.add('field-error');
                    this[field].insertAdjacentElement('afterend', div);
                }
            });
        }

        // Get default error messages
        getDefaultMessages() {
            return {
                en: {
                    fullNameError:
                        'The full name must contain at least two words.',
                    firstNameError: 'First name must be at least 2 characters.',
                    lastNameError: 'Last name must be at least 2 characters.',
                    emailError: 'Enter a valid email address.',
                    phoneNumberError: 'Enter a valid phone number.',
                },
            };
        }

        // Default configuration for phone number validation
        getDefaultItiOptions() {
            return {
                initialCountry: 'auto',
                hiddenInput: 'fullPhone',
                geoIpLookup: (callback) => {
                    const ipData = this.getCookie('ipData');
                    if (ipData) {
                        callback(JSON.parse(ipData).country_code);
                    } else {
                        fetch('https://ipapi.co/json')
                            .then((res) => res.json())
                            .then((data) => {
                                this.setCookie(
                                    'ipData',
                                    JSON.stringify(data),
                                    1
                                );
                                callback(data.country_code);
                            })
                            .catch(() => callback('us'));
                    }
                },
                utilsScript:
                    'https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js',
            };
        }

        setCookie(name, value, days) {
            const expires = new Date();
            expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
            document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
        }

        getCookie(name) {
            const match = document.cookie.match(
                new RegExp('(^| )' + name + '=([^;]+)')
            );
            return match ? match[2] : null;
        }

        // Setup international telephone input
        setupPhoneNumberInput(itiOptions) {
            if (this.phoneNumber) {
                this.loadScript(
                    'https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/intlTelInput.min.js',
                    () => {
                        this.iti = window.intlTelInput(
                            this.phoneNumber,
                            itiOptions
                        );
                    }
                );
                this.loadStylesheet(
                    'https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/css/intlTelInput.css'
                );
            }
        }

        // Dynamically load CSS file
        loadStylesheet(href) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            document.head.appendChild(link);
        }

        // Dynamically load JS file
        loadScript(src, callback) {
            const script = document.createElement('script');
            script.src = src;
            script.onload = callback;
            document.head.appendChild(script);
        }

        // Toggle validation classes
        toggleInputClass(input, isValid) {
            input.classList.toggle('error', !isValid);
            input.classList.toggle('done', isValid);
        }

        // Update the error text message
        updateErrorText(error, isValid, fieldId) {
            error.textContent = isValid
                ? ''
                : this.messages[this.language][`${fieldId}Error`];
        }

        // Validate a field using a given validation function
        validateField(fieldId, validationFunction) {
            const input = this[fieldId];
            const error = this.form.querySelector(`#${fieldId}Error`);
            if (input && error) {
                const isValid = validationFunction(input.value.trim());
                this.toggleInputClass(input, isValid);
                this.updateErrorText(error, isValid, fieldId);
                return isValid;
            }
            return true;
        }

        // Validation functions for different fields
        validateFullName(value) {
            return value.split(/\s+/).length >= 2;
        }

        validateName(value) {
            return value.length >= 2;
        }

        validateEmail(value) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        }

        validatePhoneNumber() {
            return this.iti ? this.iti.isValidNumber() : false;
        }

        // Validate the entire form
        validateForm(event) {
            event.preventDefault();
            const validationResults = this.fields.reduce((acc, fieldId) => {
                if (this[fieldId]) {
                    const validationFunction =
                        fieldId === 'email'
                            ? this.validateEmail
                            : fieldId === 'phoneNumber'
                            ? this.validatePhoneNumber.bind(this)
                            : fieldId === 'fullName'
                            ? this.validateFullName
                            : this.validateName;
                    acc[fieldId] = this.validateField(
                        fieldId,
                        validationFunction
                    );
                }
                return acc;
            }, {});

            const isValidForm = Object.values(validationResults).every(
                (result) => result
            );
            if (!isValidForm) {
                this.notifySubscribers('validationError', validationResults);
                console.warn('Form validation failed.');
            } else {
                console.log('Form successfully validated.');
                this.notifySubscribers('validationSuccess', this.form);
            }
        }

        // Handle live input validation
        handleInput(event) {
            if (event.target.tagName === 'INPUT') {
                const fieldId = event.target.id;
                if (this[fieldId]) {
                    const validationFunction =
                        fieldId === 'email'
                            ? this.validateEmail
                            : fieldId === 'phoneNumber'
                            ? this.validatePhoneNumber.bind(this)
                            : fieldId === 'fullName'
                            ? this.validateFullName
                            : this.validateName;
                    this.validateField(fieldId, validationFunction);
                }
            }
        }
    }

    return FormValidator;
});
