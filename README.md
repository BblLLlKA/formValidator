# FormValidator README

## Overview

The `FormValidator` class is a JavaScript utility designed to enhance the validation and user experience of HTML forms. It provides real-time validation for certain input fields and allows customization of error messages. This class uses the intl-tel-input library to validate international phone numbers.

## Usage

### Installation

Include the following script tags in your HTML file to load the necessary dependencies:

``

<!-- intl-tel-input script -->
<script src="https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/intlTelInput.min.js"></script>
<!-- FormValidator script -->
<script src="path/to/FormValidator.js"></script>

``

### Instantiation

Create an instance of `FormValidator` by providing the form ID as a parameter:
``

<script>
const formValidator1 = new FormValidator('myForm1'); 
</script>

``
Optionally, you can provide a second parameter for
the language (default is 'en').

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

## Example

``

<form id="myForm1">
    <label for="firstName">First Name:</label>
    <input type="text" id="firstName" name="firstName" />
    <span id="firstNameError" class="error"></span>
    <label for="lastName">Last Name:</label>
    <input type="text" id="lastName" name="lastName" />
    <span id="lastNameError" class="error"></span>
    <label for="email">Email:</label>
    <input type="email" id="email" name="email" />
    <span id="emailError" class="error"></span>
    <label for="phoneNumber">Phone Number:</label>
    <input type="tel" id="phoneNumber" name="phoneNumber" />
    <span id="phoneNumberError" class="error"></span>
    <input type="submit" value="Submit" />
</form>
<!-- Include the necessary scripts and instantiate FormValidator -->
<script src="https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/intlTelInput.min.js"></script>
<script src="path/to/FormValidator.js"></script>
<script>
    const formValidator1 = new FormValidator('myForm1');
</script>
``

### Notes

-   Ensure that the `FormValidator` script is included after the form in the HTML document.
-   If the form ID provided during instantiation is not found, an error will be logged.
-   Real-time validation occurs on input events, triggering as the user types.

Feel free to customize the script to suit your specific needs. Happy validating!
