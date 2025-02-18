# FormValidator

## Overview

The `FormValidator` class is a JavaScript utility designed to enhance the validation and user experience of HTML forms. It introduces real-time validation for specific input fields and allows for easy customization of error messages. Notably, the class integrates with the [intl-tel-input](https://intl-tel-input.com/) library, offering robust validation for international phone numbers.

## Table of Contents

-   [Usage](#usage)
-   [Installation](#installation-using-a-cdn)
-   [Instantiation](#instantiation)
-   [Features](#features)
-   [Real-time Validation](#real-time-validation)
-   [Customizable Error Messages](#customizable-error-messages)
-   [Config intl-tel-input](#config-international-telephone-input-library)
-   [Subscribe to events](#subscribe-to-events)
-   [Example](#example)
-   [Notes](#notes)

## Usage

### Installation (Using a CDN)

Include the following script tags in your HTML file to load the necessary dependencies, the class itself will plug in all the necessary dependencies:

```html
<!-- FormValidator script -->
<script src="https://cdn.jsdelivr.net/gh/BblLLlKA/formValidator/dist/latest/formValidator.min.js"></script>
```

### Installation (Not using a CDN)

Include the following script tags in your HTML file to load the required dependencies and connect the class:

```html
<!-- FormValidator script -->
<script src="path/to/formValidator.min.js"></script>
```

### Instantiation

Create an instance of `FormValidator` by providing the form ID as a parameter:

```js
const formValidator = new FormValidator('myFormId');
```

The class initialization method shown above will validate the form with the default method.

Optionally, you can specify a parameter for
language (default 'en') and messages. By default class has only English language, so to connect any other language you need to pass a message object:

```js
const formValidator = new FormValidator('myFormId', {
    language: 'uk', // Changes the language of errors to Ukrainian
    messages: {
        uk: {
            fullNameError: "Повне ім'я має містити мінімум 2 слова",
            firstNameError: "Ім'я має містити мінімум 2 символи",
            lastNameError: 'Прізвище має містити мінімум 2 символи',
            emailError: 'Введіть коректну адресу електронної пошти',
            phoneNumberError: 'Введіть коректний номер телефону',
        },
        // Add other language versions as needed
    },
});
```

If the specified language is not found in the list of messages, English will be applied.

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
    language: 'uk',
    messages: {
        uk: {
            fullNameError: "Повне ім'я має містити мінімум 2 слова",
            firstNameError: "Ім'я має містити мінімум 2 символи",
            lastNameError: 'Прізвище має містити мінімум 2 символи',
            emailError: 'Введіть коректну адресу електронної пошти',
            phoneNumberError: 'Введіть коректний номер телефону',
        },,
        en: {
            fullNameError: 'The full name must contain a minimum of 2 words',
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

You can configure the [iti](https://intl-tel-input.com/) variable for each form:

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

Default configuration writes data collected from IP to the ipData cookie to avoid repeated API requests.

### Subscribe to events

You can subscribe to some class events:

```js
const formValidator = new FormValidator('myFormId');

// Successful validation event
formValidator.on('validationSuccess', (form) => {
    // The eventData contains the form element
    console.log(form);
});

// Event of unsuccessful validation
formValidator.on('validationError', (eventResult) => {
    // eventResult contains the names of fields that have not been validated
    console.error('Form validation failed!', eventResult);
});
```

## Example

Sample form for successful initialization of a class.

```html
<form
    action="api.php"
    method="POST"
    id="myForm">
    <label for="fullName">Full name:</label>
    <input
        type="text"
        id="fullName"
        name="fullName" />

    <label for="firstName">First name:</label>
    <input
        type="text"
        id="firstName"
        name="firstName" />

    <label for="lastName">Surname:</label>
    <input
        type="text"
        id="lastName"
        name="lastName" />

    <label for="email">Email:</label>
    <input
        type="email"
        id="email"
        name="email" />

    <label for="phoneNumber">Phone Number:</label>
    <input
        type="tel"
        id="phoneNumber"
        name="phoneNumber" />

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
