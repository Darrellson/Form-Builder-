/**
 * Fetches data from "schema.json" file asynchronously.
 * Calls renderForm function with the fetched data.
 */
const fetchData = async () => {
  try {
    // Fetch data from "schema.json" using the Fetch API
    const response = await fetch("schema.json");
    // Check if the response is successful
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    // Extract JSON data from the response
    const data = await response.json();
    // Render the form based on the fetched data
    renderForm(data);
    // Set fetched data to the JSON editor
    editor.set(data);
  } catch (error) {
    // Handle any errors that occur during fetching or processing
    console.error(error.message);
  }
};

// create the editor
const container = document.getElementById("jsoneditor");
// Options for the JSON editor
const options = {
  modes: ["code", "text"],
};
// Initialize the JSON editor with specified options
const editor = new JSONEditor(container, options);

/**
 * Renders a form based on the provided data.
 * @param {Object} data - The data object containing form properties.
 */
const renderForm = (data) => {
  const profileForm = document.getElementById("profileForm");
  data.properties.forEach((property) => {
    const element = createElement(property);
    const label = createLabel(property.label);
    profileForm.append(label, element);
  });

  document
    .getElementById("submitButton")
    .addEventListener("click", handleSubmit);
};

/**
 * Creates an HTML element based on the provided property.
 * @param {Object} property - The property object.
 * @returns {HTMLElement} - The created HTML element.
 */
const createElement = (property) => {
  let element;
  switch (property.type) {
    case "array":
      element = createArrayContainer(property);
      element.append(createAddButton(property));
      break;
    case "object":
      element = document.createElement("div");
      element.classList.add("form-group", "shadow");
      element.style.padding = "10px";
      element.style.borderRadius = "10px";
      property.properties.forEach((property) => {
        const label = createLabel(property.label);
        const input = createElement(property);
        const inputWrapper = document.createElement("div");
        inputWrapper.classList.add("mb-3");
        inputWrapper.appendChild(label);
        inputWrapper.appendChild(input);
        element.appendChild(inputWrapper);
      });
      break;
    case "enum":
      element = createSelect(property.name, property.options);
      element.classList.add("form-control");
      break;
    case "boolean":
      element = createCheckbox(property.name);
      element.classList.add("form-check-input");
      break;
    default:
      element = createInput(property.name, property.type, property.label);
      element.classList.add("form-control");
  }
  if (property.required) {
    element.required = true;
  }
  return element;
};

/**
 * Creates a container for array elements with shadow.
 * @param {Object} property - The property object representing the array.
 * @returns {HTMLElement} - The container element with shadow effect.
 */
const createArrayContainer = (property) => {
  const container = document.createElement("div");
  container.classList.add("array-container", "shadow");
  container.style.padding = "10px";
  container.style.borderRadius = "10px";
  property.item.forEach((itemSchema, index) => {
    const itemElement = createElement(itemSchema);
    if (itemElement) {
      const itemContainer = document.createElement("div");
      itemContainer.classList.add("array-item-container", "mb-3");
      itemContainer.appendChild(itemElement);
      itemContainer.appendChild(createRemoveButton(itemContainer));
      container.appendChild(itemContainer);
    }
  });
  return container;
};
let arrayItemCount = 1;

/**
 * Creates an "Add" button for adding new array items.
 * @param {Object} property - The property object representing the array.
 * @returns {HTMLButtonElement} - The "Add" button element.
 */
const createAddButton = (property) => {
  const addButton = document.createElement("button");
  addButton.textContent = "Add";
  addButton.classList.add("btn", "btn-primary", "me-2");
  addButton.style.margin = "10px";
  addButton.setAttribute("type", "button");
  addButton.addEventListener("click", () => {
    const itemSchema = property.item[0];
    const itemElement = createElement(itemSchema);
    if (itemElement) {
      const container = document.createElement("div");
      container.classList.add("array-item-container", "mb-3");
      container.appendChild(itemElement);
      container.appendChild(createRemoveButton(container));
      const addButtonContainer = addButton.parentNode;
      addButtonContainer.insertBefore(container, addButton);
      arrayItemCount++;
      updateRemoveButtons();
    }
  });
  return addButton;
};

/**
 * Creates a "Remove" button for removing array items.
 * @param {HTMLElement} container - The container element wrapping the input field and remove button.
 * @returns {HTMLButtonElement} - The "Remove" button element.
 */
const createRemoveButton = (container) => {
  const removeButton = document.createElement("button");
  removeButton.textContent = "Remove";
  removeButton.classList.add("btn", "btn-danger");
  removeButton.style.margin = "10px";
  removeButton.setAttribute("type", "button");
  removeButton.addEventListener("click", () => {
    container.parentNode.removeChild(container);
    arrayItemCount--;
    updateRemoveButtons();
  });
  return removeButton;
};

/**
 * Updates the state of remove buttons based on the number of array items.
 */
const updateRemoveButtons = () => {
  const removeButtons = document.querySelectorAll(
    ".array-item-container .btn-danger"
  );
  if (arrayItemCount > 1) {
    removeButtons.forEach((button) => button.removeAttribute("disabled"));
  } else {
    removeButtons.forEach((button) =>
      button.setAttribute("disabled", "disabled")
    );
  }
};

/**
 * Creates a label element with the given text.
 * @param {string} text - The text content of the label.
 * @returns {HTMLLabelElement} - The created label element.
 */
const createLabel = (text) => {
  const label = document.createElement("label");
  label.textContent = text;
  label.classList.add("form-label");
  return label;
};

/**
 * Creates an input element with the given name, type, and placeholder.
 * @param {string} name - The name attribute of the input.
 * @param {string} type - The type attribute of the input.
 * @param {string} placeholder - The placeholder text for the input.
 * @returns {HTMLInputElement} - The created input element.
 */
const createInput = (name, type, placeholder) => {
  const input = document.createElement("input");
  input.setAttribute("name", name);
  input.classList.add("form-control");
  input.setAttribute("type", type);
  input.setAttribute("placeholder", placeholder);
  return input;
};

/**
 * Creates a select element with the given name and options.
 * @param {string} name - The name attribute of the select.
 * @param {Array<Object>} options - An array of option objects.
 * @returns {HTMLSelectElement} - The created select element.
 */
const createSelect = (name, options) => {
  const select = document.createElement("select");
  select.setAttribute("name", name);
  select.classList.add("form-select");
  options.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.setAttribute("value", option.value);
    optionElement.textContent = option.label;
    select.appendChild(optionElement);
  });
  return select;
};

/**
 * Creates a checkbox element with the given name.
 * @param {string} name - The name attribute of the checkbox.
 * @returns {HTMLInputElement} - The created checkbox element.
 */
const createCheckbox = (name) => {
  const checkbox = document.createElement("input");
  checkbox.setAttribute("name", name);
  checkbox.classList.add("form-check-input");
  checkbox.setAttribute("type", "checkbox");
  return checkbox;
};

/**
 * Handles form submission.
 * Prevents the default form submission behavior and logs form data.
 * @param {Event} event - The submit event object.
 */
const handleSubmit = (event) => {
  event.preventDefault();
  const formData = new FormData(document.getElementById("profileForm"));
  const data = {};
  formData.forEach((value, key) => {
    if (!data[key]) {
      data[key] = value;
      return;
    }
    if (!Array.isArray(data[key])) {
      data[key] = [data[key]];
    }
    data[key] = [...data[key], value];
  });
  console.log(data);
};

fetchData();
