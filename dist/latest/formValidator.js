(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        global.FormValidator = factory();
    }
})(typeof window !== 'undefined' ? window : this, function () {
    /**
     * FormValidator class for handling form validation.
     * @class
     */
    class FormValidator {
        static version = '1.0.1';
        /**
         * Constructor function for FormValidator.
         * @constructor
         * @param {string} formId - The id of the HTML form element.
         * @param {Object} [options={}] - Options for the FormValidator.
         * @param {string} [options.language='en'] - The language for error messages.
         * @param {Object} [options.messages] - Custom error messages.
         */
        constructor(formId, options = {}) {
            this.form = document.getElementById(formId);

            if (!this.form) {
                throw new Error(`Form with id "${formId}" not found.`);
            }

            this.language = options.language
                ? options.language.toLowerCase()
                : 'en';

            this.setupPhoneNumberInput();
            this.events = {
                validationSuccess: [],
                validationError: [],
                handleInput: [],
            };
            this.form.addEventListener('submit', this.validateForm.bind(this));
            this.form.addEventListener('input', this.handleInput.bind(this));

            this.messages = options.messages || this.getDefaultMessages();

            if (!this.messages[this.language]) {
                console.warn(
                    `Language "${this.language}" not found in messages. Using default language.`
                );
                this.language = 'en';
            }
        }

        /**
         * Subscribe to an event.
         * @param {string} eventName - The name of the event to subscribe to.
         * @param {Function} callback - The callback function to be called on the event.
         */
        on(eventName, callback) {
            if (typeof callback === 'function' && this.events[eventName]) {
                this.events[eventName].push(callback);
            }
        }

        /**
         * Notify all subscribers about an event.
         * @param {string} eventName - The name of the event.
         * @param {Object} eventData - Additional data related to the event.
         */
        notifySubscribers(eventName, eventData) {
            if (this.events[eventName]) {
                this.events[eventName].forEach((callback) => {
                    callback(eventData);
                });
            }
        }

        /**
         * Set up the international telephone input library for phone number validation.
         */
        setupPhoneNumberInput() {
            const phoneNumberInput = this.form.querySelector('#phoneNumber');
            if (phoneNumberInput) {
                this.addStylesheet(
                    'https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/css/intlTelInput.css'
                );
                this.iti = window.intlTelInput(phoneNumberInput, {
                    initialCountry: 'auto',
                    hiddenInput: 'full_phone',
                    geoIpLookup: (callback) => {
                        fetch('https://ipapi.co/json')
                            .then((res) => res.json())
                            .then((data) => callback(data.country_code))
                            .catch(() => callback('us'));
                    },
                    utilsScript:
                        'https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js',
                });
            }
        }

        /**
         * Add a stylesheet to the document head.
         * @param {string} href - The URL of the stylesheet.
         */
        addStylesheet(href) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            document.head.appendChild(link);
        }

        /**
         * Get the default error messages.
         * @returns {Object} - Default error messages.
         */
        getDefaultMessages() {
            return {
                en: {
                    firstNameError:
                        'First name should be at least 2 characters long',
                    lastNameError:
                        'Last name should be at least 2 characters long',
                    emailError: 'Enter a valid email address',
                    phoneNumberError: 'Enter a valid phone number',
                },
            };
        }

        /**
         * Validate a form field based on the provided validation function.
         * @param {string} fieldName - The name of the form field.
         * @param {Function} validationFunction - The validation function for the field.
         * @returns {boolean} - Whether the field is valid or not.
         */
        validateField(fieldName, validationFunction) {
            const input = this.form.querySelector(`#${fieldName}`);
            const error = this.form.querySelector(`#${fieldName}Error`);

            if (input || error) {
                const value = input.value.trim();
                const isValid = validationFunction(value);

                this.toggleInputClass(input, isValid);
                this.updateErrorText(error, isValid, fieldName);

                return isValid;
            }
        }

        /**
         * Toggle CSS classes on an input element based on validation result.
         * @param {HTMLElement} input - The input element.
         * @param {boolean} isValid - Whether the input is valid or not.
         */
        toggleInputClass(input, isValid) {
            input.classList.remove(isValid ? 'error' : 'done');
            input.classList.add(isValid ? 'done' : 'error');
        }

        /**
         * Update error text on the page based on validation result.
         * @param {HTMLElement} error - The error element.
         * @param {boolean} isValid - Whether the field is valid or not.
         * @param {string} fieldName - The name of the form field.
         */
        updateErrorText(error, isValid, fieldName) {
            error.textContent = isValid
                ? ''
                : this.messages[this.language][`${fieldName}Error`];
        }

        /**
         * Validation function for name (length at least 2 characters).
         * @param {string} value - The value of the input field.
         * @returns {boolean} - Whether the name is valid or not.
         */
        validateName(value) {
            return value.length >= 2;
        }

        /**
         * Validation function for email (format and regex check).
         * @param {string} value - The value of the input field.
         * @returns {boolean} - Whether the email is valid or not.
         */
        validateEmail(value) {
            const emailInput = this.form.querySelector('#email');
            const isValidFormat = emailInput.checkValidity();
            const isValidRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                value.trim()
            );
            return isValidFormat && isValidRegex;
        }

        /**
         * Validation function for phone number using the international telephone input library.
         * @returns {boolean} - Whether the phone number is valid or not.
         */
        validatePhoneNumber() {
            return this.iti.isValidNumber();
        }

        /**
         * Validate the entire form.
         * @param {Event} event - The form submission event.
         */
        validateForm(event) {
            event.preventDefault();

            const fieldsToValidate = [
                'firstName',
                'lastName',
                'email',
                'phoneNumber',
            ];

            const validationResult = {};

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
                if (field) {
                    validationResult[fieldName] = this.validateField(
                        fieldName,
                        validationFunction
                    );
                } else {
                    console.warn(`Field "${fieldName}" not found.`);
                    validationResult[fieldName] = true;
                }
                return validationResult[fieldName];
            });
            if (!isValidForm) {
                this.notifySubscribers('validationError', validationResult);
                throw new Error('Form validation failed.');
            } else {
                this.notifySubscribers('validationSuccess', validationResult);
                console.log('Form submitted successfully.');
                event.target.submit();
            }
        }

        /**
         * Handle input events on the form (used for real-time validation).
         * @param {Event} event - The input event.
         */
        handleInput(event) {
            const target = event.target;

            if (target.tagName === 'INPUT') {
                this.notifySubscribers('handleInput', event.target);
                const fieldName = target.name;
                const validationFunction =
                    fieldName === 'email'
                        ? this.validateEmail.bind(this)
                        : this[
                              fieldName === 'phoneNumber'
                                  ? 'validatePhoneNumber'
                                  : 'validateName'
                          ].bind(this);

                this.validateField(fieldName, validationFunction);
            }
        }
    }

    return FormValidator;
});
