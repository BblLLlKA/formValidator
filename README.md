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
-   [Config intl-tel-input](#config-international-telephone-input-library)
-   [Subscribe to events](#subscribe-to-events)
-   [Demo and Example](#example)
-   [Notes](#notes)

## Usage

### Installation (Using a CDN)

Include the following script tags in your HTML file to load the necessary dependencies, the library itself will plug in all the necessary dependencies:

```html
<!-- FormValidator script -->
<script src="https://cdn.jsdelivr.net/gh/BblLLlKA/formValidator/dist/latest/formValidator.min.js"></script>
```

### Installation (Not using a CDN)

Include the following script tags in your HTML file to load the necessary dependencies:

```html
<!-- FormValidator script -->
<script src="path/to/formValidator.min.js"></script>
```

### Instantiation

Create an instance of `FormValidator` by providing the form ID as a parameter:

```js
const formValidator = new FormValidator('myFormId');
```

Optionally, you can provide a second parameter for
the language (default is 'en') or messages.

## Features

### Real-time Validation

The class supports real-time validation for the following input fields:

-   **Full Name:** Requires at least 2 words.
-   **First Name:** Requires at least 2 characters.
-   **Last Name:** Requires at least 2 characters.
-   **Email:** Validates both format and regex.
-   **Phone Number:** Validates using the international telephone input library.

Elements are taken by their IDs, so the presence of identifiers "fullName, firstName, lastName, email, phoneNumber" on the corresponding inputs is mandatory.

### Customizable Error Messages

You can customize error messages for each field by modifying the `messages`
object within the class. The default messages are in English.

```js
const formValidator = new FormValidator('myFormId', {
    language: 'ru',
    messages: {
        ru: {
            fullNameError: 'Полное имя должно содержать минимум 2 слова'
            firstNameError: 'Имя должно содержать минимум 2 символа',
            lastNameError: 'Фамилия должна содержать минимум 2 символа',
            emailError: 'Введите корректный адрес электронной почты',
            phoneNumberError: 'Введите корректный номер телефона',
        },
        en: {
            fullNameError: 'The full name must contain a minimum of 2 words'
            firstNameError: 'First name should be at least 2 characters long',
            lastNameError: 'Last name should be at least 2 characters long',
            emailError: 'Enter a valid email address',
            phoneNumberError: 'Enter a valid phone number',
        },
        // Add other language versions as needed
    },
});
```

### Config international telephone input library

You can configure the iti variable for each form:

```js
const formValidator = new FormValidator('myFormId', {
    iti: {
        initialCountry: 'us',
        hiddenInput: 'fullPhone',
        onlyCountries: ['us'],
        utilsScript:
            'https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js',
    },
});
```

### Subscribe to events

You can subscribe to some class events:

```js
const formValidator = new FormValidator('myFormId');

// Successful validation event
formValidator.on('validationSuccess', (form) => {
    // The eventData contains the form element
    setTimeout(() => {
        form.submit();
    }, 300);
});

// Event of unsuccessful validation
formValidator.on('validationError', (eventData) => {
    // eventData contains the names of fields that have not been validated
    console.error('Form validation failed!', eventData);
});
```

## Example

You can view [a live demo](https://github.com/BblLLlKA/formValidator/tree/main/examples) and see some examples of how to use the various options.

```html
<form action="api.php" method="POST" id="myForm">
    <label for="fullName">Full name:</label>
    <input type="text" id="fullName" name="fullName" />

    <label for="firstName">First name:</label>
    <input type="text" id="firstName" name="firstName" />

    <label for="lastName">Surname:</label>
    <input type="text" id="lastName" name="lastName" />

    <label for="email">Email:</label>
    <input type="email" id="email" name="email" />

    <label for="phoneNumber">Phone Number:</label>
    <input type="tel" id="phoneNumber" name="phoneNumber" />

    <button type="submit">Send</button>
</form>
<!-- Include the necessary scripts and instantiate FormValidator -->
<script src="https://cdn.jsdelivr.net/gh/BblLLlKA/formValidator/dist/latest/formValidator.min.js"></script>
<script>
    const formValidator = new FormValidator('myFormId');
</script>
```

### Notes

-   Ensure that the `FormValidator` script is included after the form in the HTML document.
-   If the form ID provided during instantiation is not found, an error will be logged.
-   Real-time validation occurs on input events, triggering as the user types.

Feel free to customize the script to suit your specific needs. Happy validating!
