# FormValidator

## Overview

The `FormValidator` library is a JavaScript utility designed to enhance the validation and user experience of HTML forms. It introduces real-time validation for specific input fields and allows for easy customization of error messages. Notably, the library integrates with the [intl-tel-input](https://intl-tel-input.com/) library, offering robust validation for international phone numbers.

## Table of Contents

-   [Usage](#usage)
-   [Installation](#installation-using-a-cdn)
-   [Instantiation](#instantiation)
-   [Features](#features)
-   [Real-time Validation](#real-time-validation)
-   [Customizable Error Messages](#customizable-error-messages)
-   [Demo and Example](#example)
-   [Notes](#notes)

## Usage

### Installation (Using a CDN)

Include the following script tags in your HTML file to load the necessary dependencies:

```html
<!-- intl-tel-input script -->
<script src="https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/intlTelInput.min.js"></script>
<!-- FormValidator script -->
<script src="https://cdn.jsdelivr.net/gh/BblLLlKA/formValidator/dist/latest/formValidator.min.js"></script>
```

### Installation (Not using a CDN)

Include the following script tags in your HTML file to load the necessary dependencies:

```html
<!-- intl-tel-input script -->
<script src="https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/intlTelInput.min.js"></script>
<!-- FormValidator script -->
<script src="path/to/formValidator.min.js"></script>
```

### Instantiation

Create an instance of `FormValidator` by providing the form ID as a parameter:

```js
const formValidator1 = new FormValidator('myForm1');
```

Optionally, you can provide a second parameter for
the language (default is 'en') or messages.

## Features

### Real-time Validation

The class supports real-time validation for the following input fields:

-   **First Name:** Requires at least 2 characters.
-   **Last Name:** Requires at least 2 characters.
-   **Email:** Validates both format and regex.
-   **Phone Number:** Validates using the international telephone input library.

### Customizable Error Messages

You can customize error messages for each field by modifying the `messages`
object within the class. The default messages are in English.

```js
const formValidator = new FormValidator('myForm', {
    language: 'ru',
    messages: {
        ru: {
            firstNameError: 'Имя должно содержать минимум 2 символа',
            lastNameError: 'Фамилия должна содержать минимум 2 символа',
            emailError: 'Введите корректный адрес электронной почты',
            phoneNumberError: 'Введите корректный номер телефона',
        },
        en: {
            firstNameError: 'First name should be at least 2 characters long',
            lastNameError: 'Last name should be at least 2 characters long',
            emailError: 'Enter a valid email address',
            phoneNumberError: 'Enter a valid phone number',
        },
        // Add other language versions as needed
    },
});
```

## Example

You can view [a live demo](https://github.com/BblLLlKA/formValidator/tree/main/examples) and see some examples of how to use the various options.

```html
<form action="api.php" method="POST" id="myForm">
    <label for="firstName">Name:</label>
    <input type="text" id="firstName" name="firstName" />
    <div class="error" id="firstNameError"></div>

    <label for="lastName">Surname:</label>
    <input type="text" id="lastName" name="lastName" />
    <div class="error" id="lastNameError"></div>

    <label for="email">Email:</label>
    <input type="email" id="email" name="email" />
    <div class="error" id="emailError"></div>

    <label for="phoneNumber">Phone Number:</label>
    <input type="tel" id="phoneNumber" name="phoneNumber" />
    <div class="error" id="phoneNumberError"></div>

    <button type="submit">Send</button>
</form>
<!-- Include the necessary scripts and instantiate FormValidator -->
<script src="https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/intlTelInput.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/BblLLlKA/formValidator/dist/latest/formValidator.min.js"></script>
<script>
    const formValidator1 = new FormValidator('myForm');
</script>
```

### Notes

-   Ensure that the `FormValidator` script is included after the form in the HTML document.
-   If the form ID provided during instantiation is not found, an error will be logged.
-   Real-time validation occurs on input events, triggering as the user types.

Feel free to customize the script to suit your specific needs. Happy validating!
