// Add an event listener to the 'DOMContentLoaded' event which fires when the initial HTML document has been completely loaded and parsed
document.addEventListener("DOMContentLoaded", async () => {
  // Fetch the JSON schema file 'schema.json' asynchronously when the DOM content is loaded
  const response = await fetch('schema.json');
  // Parse the fetched JSON response into a JavaScript object representing the schema
  const schema = await response.json();
  // Get the form element with the ID 'profileForm'
  const form = document.getElementById('profileForm');
  // Call a function named 'generateFormFields' and pass the schema object and form element as arguments to generate form fields based on the schema
  generateFormFields(schema, form);
  // Get the submit button element with the ID 'submitButton'
  const submitButton = document.getElementById('submitButton');
  // Add an event listener to the submit button that listens for 'click' events and executes the 'handleSubmit' function when clicked
  submitButton.addEventListener('click', handleSubmit);
});

// Define a function called generateFormFields which takes two parameters: schema and form
const generateFormFields = (schema, form) => {
  // Iterate through each property in the schema
  schema.properties.forEach(property => {
      // Create a label element for the property
      const label = document.createElement('label');
      // Set the text content of the label to the property's label
      label.textContent = property.label;
      // Check if the property is of boolean type
      if (property.type === 'boolean') {
          // Create a div element to wrap the checkbox and label (for Bootstrap styling)
          const checkboxDiv = document.createElement('div');
          // Add the Bootstrap form-check class to the div
          checkboxDiv.classList.add('form-check');

          // Create a checkbox input element
          const checkbox = document.createElement('input');
          // Set the type of the input element to checkbox
          checkbox.setAttribute('type', 'checkbox');
          // Set the name attribute of the input element to the property name
          checkbox.setAttribute('name', property.name);
          // Add the Bootstrap form-check-input class to the checkbox
          checkbox.classList.add('form-check-input');

          // Create a label element for the checkbox
          const checkboxLabel = document.createElement('label');
          // Add the Bootstrap form-check-label class to the label
          checkboxLabel.classList.add('form-check-label');
          // Set the text content of the label to the property's label
          checkboxLabel.textContent = property.label;

          // Append the checkbox and label to the checkboxDiv
          checkboxDiv.appendChild(checkbox);
          checkboxDiv.appendChild(checkboxLabel);

          // Append the checkboxDiv to the form
          form.appendChild(checkboxDiv);
      } else {
          // If the property is not boolean, create a regular input field or select dropdown

          // Create an input element
          const input = document.createElement('input');
          // Set the name attribute of the input element to the property name
          input.setAttribute('name', property.name);
          // Add the Bootstrap form-control class to the input element
          input.setAttribute('class', 'form-control');

          // Set the type of the input element (default to 'text' if not specified)
          if (property.inputType) {
              input.setAttribute('type', property.inputType);
          } else {
              input.setAttribute('type', 'text');
          }
          // Set additional attributes based on property requirements (required, minLength, maxLength)
          if (property.required) {
              input.setAttribute('required', true);
          }
          if (property.minLength) {
              input.setAttribute('minlength', property.minLength);
          }
          if (property.maxLength) {
              input.setAttribute('maxlength', property.maxLength);
          }
          // If the property is an email type, set the pattern attribute to enforce email pattern
          if (property.inputType === 'email') {
              input.setAttribute('pattern', '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$');
          }
          // If the property is a phone type, set the pattern attribute to enforce phone pattern
          if (property.inputType === 'tel') {
              input.setAttribute('pattern', '^\\d{8,20}$');
          }
          // If the property has options (enum), create a select dropdown
          if (property.options) {
              // Create a select element
              const select = document.createElement('select');
              // Set the name attribute of the select element to the property name
              select.setAttribute('name', property.name);
              // Add the Bootstrap form-select class to the select element
              select.setAttribute('class', 'form-select');

              // If the property is required, set the required attribute for the select element
              if (property.required) {
                  select.setAttribute('required', true);
              }
              // Iterate through each option in the property options
              property.options.forEach(option => {
                  // Create an option element
                  const optionElement = document.createElement('option');
                  // Set the value attribute of the option to the option's value
                  optionElement.setAttribute('value', option.value);
                  // Set the text content of the option to the option's label
                  optionElement.textContent = option.label;
                  // Append the option to the select element
                  select.appendChild(optionElement);
              });
              // Append the label element to the form
              form.appendChild(label);
              // Append the select element to the form
              form.appendChild(select);
          } else {
              // If the property does not have options, append the label and input to the form
              // Append the label element to the form
              form.appendChild(label);
              // Append the input element to the form
              form.appendChild(input);
          }
      }
  });
};
// Define a function called handleSubmit which takes an event object as a parameter
const handleSubmit = (event) => {
  // Prevent the default form submission behavior
  event.preventDefault();
  // Get the form element using its ID ('profileForm')
  const form = document.getElementById('profileForm');
  // Get form data using FormData API, which allows gathering form data in a FormData object
  const formData = new FormData(form);
  // Create an empty object to store form data
  const formDataObj = {};
  // Convert FormData to object
  formData.forEach((value, key) => {
      // Assign each form field's value to its corresponding key in the object
      formDataObj[key] = value;
  });
  // Output form data as JSON object to the console
  console.log(JSON.stringify(formDataObj));
}
