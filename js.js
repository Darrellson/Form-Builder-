// Event listener for when the DOM content is loaded
document.addEventListener("DOMContentLoaded", async () => {
    // Fetches the 'schema.json' file asynchronously
    const response = await fetch('schema.json');
    // Extracts JSON data from the response
    const schema = await response.json();
    // Retrieves the form element with ID 'profileForm'
    const form = document.getElementById('profileForm');
    // Generates form fields based on the schema
    generateFormFields(schema, form);
    // Adds an event listener to the submit button to handle form submission
    document.getElementById('submitButton').addEventListener('click', handleSubmit);
});
// Function to generate form fields based on schema
const generateFormFields = (schema, form) => {
    // Iterates through each property in the schema
    schema.properties.forEach(property => {
        // Creates a label element for the property
        const label = document.createElement('label');
        // Sets the text content of the label to the property's label
        label.textContent = property.label;
        // Checks if the property is an array of technologies
        if (property.name === 'technologies') {
            // Creates div to wrap technologies
            const technologiesDiv = document.createElement('div');
            // Adds Bootstrap class to the div
            technologiesDiv.classList.add('technologies-container');
            // Iterates through each item in technologies
            property.item.forEach((index) => {
                // Creates div for each technology
                const technologyDiv = document.createElement('div');
                // Sets class for technology div
                technologyDiv.classList.add('technology-item');
                // Creates input for technology name
                const techInput = document.createElement('input');
                techInput.setAttribute('type', 'text');
                techInput.setAttribute('name', `technologies[${index}].technology`);
                techInput.setAttribute('placeholder', 'Technology');
                techInput.classList.add('form-control');
                // Creates input for experience
                const expInput = document.createElement('input');
                expInput.setAttribute('type', 'number');
                expInput.setAttribute('name', `technologies[${index}].experience`);
                expInput.setAttribute('placeholder', 'Experience (years)');
                expInput.classList.add('form-control');
                // Appends inputs to technology div
                technologyDiv.appendChild(techInput);
                technologyDiv.appendChild(expInput);
                // Appends technology div to technologies container
                technologiesDiv.appendChild(technologyDiv);
            });
            // Appends label and technologies div to the form
            form.appendChild(label);
            form.appendChild(technologiesDiv);
        } else if (property.name === 'links') {
            // Creates div to wrap links
            const linksDiv = document.createElement('div');
            // Adds class to the div
            linksDiv.classList.add('links-container');
            // Iterates through each property in links
            property.properties.forEach(linkProperty => {
                // Creates input for each link property
                const input = document.createElement('input');
                input.setAttribute('name', linkProperty.name);
                input.setAttribute('type', 'text');
                input.setAttribute('placeholder', linkProperty.label);
                input.classList.add('form-control');
                // Appends input to links div
                linksDiv.appendChild(input);
            });
            // Appends label and links div to the form
            form.appendChild(label);
            form.appendChild(linksDiv);
        } else {
            // For non-array properties, creates input or select elements
            const input = document.createElement('input');
            input.setAttribute('name', property.name);
            input.classList.add('form-control');
            input.setAttribute('type', property.inputType || 'text');
            // Sets additional attributes based on property requirements
            if (property.required) input.setAttribute('required', true);
            if (property.minLength) input.setAttribute('minlength', property.minLength);
            if (property.maxLength) input.setAttribute('maxlength', property.maxLength);
            if (property.inputType === 'email') input.setAttribute('pattern', '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$');
            if (property.inputType === 'tel') input.setAttribute('pattern', '^\\d{8,20}$');
            // Checks if the property has options (enum)
            if (property.options) {
                // Creates a select element
                const select = document.createElement('select');
                select.setAttribute('name', property.name);
                select.classList.add('form-select');
                if (property.required) select.setAttribute('required', true);
                // Iterates through each option in the property options
                property.options.forEach(option => {
                    // Creates an option element for each option
                    const optionElement = document.createElement('option');
                    optionElement.setAttribute('value', option.value);
                    optionElement.textContent = option.label;
                    select.appendChild(optionElement);
                });
                // Appends label and select elements to the form
                form.appendChild(label);
                form.appendChild(select);
            } else {
                // For properties without options, appends label and input elements to the form
                form.appendChild(label);
                form.appendChild(input);
            }
        }
    });
};
// Function to handle form submission
const handleSubmit = (event) => {
    // Prevents default form submission behavior
    event.preventDefault();
    // Retrieves form data using FormData API
    const formData = new FormData(document.getElementById('profileForm'));
    // Converts FormData to a JavaScript object
    const formDataObj = {};
    formData.forEach((value, key) => formDataObj[key] = value);
    // Logs form data as a JSON object to the console
    console.log(JSON.stringify(formDataObj));
};
