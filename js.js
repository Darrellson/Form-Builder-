// Event listener for when the DOM content is loaded
document.addEventListener("DOMContentLoaded", async () => {
    // Fetches the schema asynchronously
    const schema = await fetchSchema('schema.json');
    // Retrieves the form element with ID 'profileForm'
    const form = document.getElementById('profileForm');
    // Generates form fields based on the schema
    generateFormFields(schema, form);
    // Adds event listener to submit button
    document.getElementById('submitButton').addEventListener('click', handleSubmit);
});
// Function to fetch JSON schema
const fetchSchema = async (url) => await (await fetch(url)).json();
// Function to generate form fields based on a JSON schema and apply Bootstrap styling
const generateFormFields = (schema, form) => {
    // Iterate over each property in the schema
    Object.values(schema.properties).forEach(property => {
        // Create label for the property
        const label = createLabel(property.label);
        // Append the label to the form
        form.appendChild(label);
        // Check if property type is an array
        if (property.type === 'array') {
            // Create container for array items
            const arrayDiv = createContainer('div', 'array-container');
            // Create "Add" button
            const addButton = createButton('Add', 'btn-primary', () => generateFormFields(property.item[0], arrayDiv));
            // Add event listener to "Add" button
            addButton.addEventListener('click', () => generateFormFields(property.item[0], arrayDiv));
            // Append "Add" button to array container
            arrayDiv.appendChild(addButton);
            // Append array container to the form
            form.appendChild(arrayDiv);
        } else if (property.type === 'object') {
            // Recursively generate form fields for object properties
            generateFormFields(property, form);
        } else {
            // Property type is neither an array nor an object
            // Determine input type based on property type
            const element = property.type === 'boolean' ? createCheckbox(property) : property.name === 'plans' ? createTextarea(property) : createInput(property);
            // Append input element to the form
            form.appendChild(element);
        }
    });
};
// Function to create label element
const createLabel = (text) => {
    const label = document.createElement('label');
    label.textContent = text;
    label.classList.add('form-label');
    return label;
};
// Function to create container element
const createContainer = (type, className) => {
    const container = document.createElement(type);
    container.classList.add(className);
    return container;
};
// Function to create button element
const createButton = (text, btnClass, onClick) => {
    const button = document.createElement('button');
    button.textContent = text;
    button.type = 'button';
    button.classList.add('btn', btnClass, 'mb-3');
    button.addEventListener('click', onClick);
    return button;
};
// Function to create input element
const createInput = (property) => {
    const input = document.createElement('input');
    input.setAttribute('name', property.name);
    input.classList.add('form-control');
    input.setAttribute('type', property.inputType || 'text');
    if (property.required) input.setAttribute('required', true);
    if (property.minLength) input.setAttribute('minlength', property.minLength);
    if (property.maxLength) input.setAttribute('maxlength', property.maxLength);
    if (property.inputType === 'email') input.setAttribute('pattern', '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$');
    if (property.inputType === 'tel') input.setAttribute('pattern', '^\\d{8,20}$');
    if (property.options) input.replaceWith(createSelect(property));
    return input;
};
// Function to create select element
const createSelect = (property) => {
    const select = document.createElement('select');
    select.setAttribute('name', property.name);
    select.classList.add('form-select');
    if (property.required) select.setAttribute('required', true);
    property.options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.setAttribute('value', option.value);
        optionElement.textContent = option.label;
        select.appendChild(optionElement);
    });
    return select;
};
// Function to create checkbox input element
const createCheckbox = (property) => {
    const checkbox = document.createElement('input');
    checkbox.setAttribute('name', property.name);
    checkbox.classList.add('form-check-input');
    checkbox.setAttribute('type', 'checkbox');
    if (property.required) checkbox.setAttribute('required', true);
    return checkbox;
};
// Function to create textarea element
const createTextarea = (property) => {
    const textarea = document.createElement('textarea');
    textarea.setAttribute('name', property.name);
    textarea.classList.add('form-control');
    textarea.setAttribute('rows', '3');
    if (property.required) textarea.setAttribute('required', true);
    return textarea;
};
// Function to handle form submission
const handleSubmit = (event) => {
    event.preventDefault();
    // Retrieve form data using FormData API
    const formData = Object.fromEntries(new FormData(document.getElementById('profileForm')).entries());
    // Log form data as a JSON object to the console
    console.log(formData);
};
