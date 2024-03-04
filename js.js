const fetchData = async () => {
  // Declaring an asynchronous function named fetchData
  const response = await fetch("schema.json"); // Making a GET request to fetch the "schema.json" file
  if (!response.ok) {
    // Checking if the response status is not okay (i.e., not in the range 200-299)
    throw new Error("Failed to fetch data"); // Throwing an error if fetching the data failed
  }
  const data = await response.json(); // Parsing the response body as JSON and storing it in the variable data
  renderForm(data); // Calling the renderForm function with the fetched data
};
fetchData(); // Calling the fetchData function immediately upon script execution
const renderForm = (data) => {
  // Defining a function renderForm which takes data as input
  const profileForm = document.getElementById("profileForm"); // Getting the form element with id "profileForm"
  data.properties.forEach((property) => {
    // Iterating through each property in the data object
    const element = createElement(property); // Creating an HTML element based on the property type
    const label = createLabel(property.label); // Creating a label element for the property
    profileForm.appendChild(label); // Appending the label element to the form
    profileForm.appendChild(element); // Appending the input element to the form
  });

  const submitButton = document.getElementById("submitButton"); // Getting the submit button element
  submitButton.addEventListener("click", handleSubmit); // Adding a click event listener to the submit button
};
const createElement = (property) => {
  // Defining a function createElement which takes a property as input
  let element; // Declaring a variable to hold the HTML element
  switch (
    property.type // Switch statement to determine the type of HTML element to create based on property type
  ) {
    case "array": // If property type is "array"
      element = createArray(property.name, property.item); // Call createArray function to create an array element
      break;
    case "enum": // If property type is "enum"
      element = createSelect(property.name, property.options); // Call createSelect function to create a select element
      break;
    case "object": // If property type is "object"
      element = createObject(property.properties); // Call createObject function to create an object element
      break;
    case "boolean": // If property type is "boolean"
      element = createCheckbox(property.name); // Call createCheckbox function to create a checkbox element
      break;
    default: // For other property types
      element = createInput(property.name, property.type); // Call createInput function to create an input element
  }
  if (property.required) {
    // Checking if the property is required
    element.required = true; // Setting the required attribute of the element to true
  }
  return element; // Returning the created HTML element
};
// Functions to create specific HTML elements with given properties
const createLabel = (text) => {
  // Function to create a label element with given text
  const label = document.createElement("label"); // Creating a label element
  label.textContent = text; // Setting the text content of the label
  label.classList.add("form-label"); // Adding a CSS class to the label
  return label; // Returning the created label element
};
const createInput = (name, type) => {
  // Function to create an input element with given name and type
  const input = document.createElement("input"); // Creating an input element
  input.setAttribute("name", name); // Setting the name attribute of the input
  input.classList.add("form-control"); // Adding a CSS class to the input
  input.setAttribute("type", type); // Setting the type attribute of the input
  return input; // Returning the created input element
};
const createSelect = (name, options) => {
  // Function to create a select element with given name and options
  const select = document.createElement("select"); // Creating a select element
  select.setAttribute("name", name); // Setting the name attribute of the select
  select.classList.add("form-select"); // Adding a CSS class to the select
  options.forEach((option) => {
    // Iterating through each option
    const optionElement = document.createElement("option"); // Creating an option element
    optionElement.setAttribute("value", option.value); // Setting the value attribute of the option
    optionElement.textContent = option.label; // Setting the text content of the option
    select.appendChild(optionElement); // Appending the option element to the select
  });
  return select; // Returning the created select element
};
const createArray = (name, items) => {
  // Function to create a container for array elements
  const arrayContainer = document.createElement("div"); // Creating a div element
  arrayContainer.classList.add("array-container"); // Adding a CSS class to the div
  items.forEach((itemSchema) => {
    // Iterating through each item schema
    const itemElement = createElement(itemSchema); // Creating an HTML element for the item schema
    if (itemElement) {
      // Checking if the item element is valid
      arrayContainer.appendChild(itemElement); // Appending the item element to the container
    }
  });
  return arrayContainer; // Returning the created container element
};
const createObject = (properties) => {
  // Function to create a container for object properties
  const objectContainer = document.createElement("div"); // Creating a div element
  properties.forEach((property) => {
    // Iterating through each property
    const element = createElement(property); // Creating an HTML element for the property
    const label = createLabel(property.label); // Creating a label for the property
    objectContainer.appendChild(label); // Appending the label to the container
    objectContainer.appendChild(element); // Appending the element to the container
  });
  return objectContainer; // Returning the created container element
};
const createCheckbox = (name) => {
  // Function to create a checkbox element with given name
  const checkbox = document.createElement("input"); // Creating an input element
  checkbox.setAttribute("name", name); // Setting the name attribute of the input
  checkbox.classList.add("form-check-input"); // Adding a CSS class to the input
  checkbox.setAttribute("type", "checkbox"); // Setting the type attribute of the input to "checkbox"
  return checkbox; // Returning the created checkbox element
};
const handleSubmit = (event) => {
  // Function to handle form submission
  event.preventDefault(); // Preventing the default form submission behavior
  const formData = new FormData(document.getElementById("profileForm")); // Creating FormData object from the form
  const data = {}; // Initializing an empty object to store form data
  formData.forEach((value, key) => {
    // Iterating through each form data entry
    if (!data[key]) {
      // If the key doesn't exist in the data object
      data[key] = value; // Assigning the value to the key in the data object
      return; // Exiting the loop iteration
    }
    if (!Array.isArray(data[key])) {
      // If the value is not an array
      data[key] = [data[key]]; // Convert the value to an array
    }
    data[key].push(value); // Pushing the new value to the array
  });
  console.log(data); // Logging the form data object to the console
};
