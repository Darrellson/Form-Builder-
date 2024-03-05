/**
 * Fetches data from "schema.json" file asynchronously.
 * Calls renderForm function with the fetched data.
 */
const fetchData = async () => {
  try {
    const response = await fetch("schema.json");
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    renderForm(data);
  } catch (error) {
    console.error(error.message);
  }
};

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

  document.getElementById("submitButton").addEventListener("click", handleSubmit);
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
      property.properties.forEach((property) => {
        element.append(createLabel(property.label), createElement(property));
      });
      break;
    case "enum":
      element = createSelect(property.name, property.options);
      break;
    case "boolean":
      element = createCheckbox(property.name);
      break;
    default:
      element = createInput(property.name, property.type);
  }
  if (property.required) {
    element.required = true;
  }
  return element;
};

/**
 * Creates a container for array elements.
 * @param {Object} property - The property object representing the array.
 * @returns {HTMLElement} - The container element.
 */
const createArrayContainer = (property) => {
  const container = document.createElement("div");
  container.classList.add("array-container");
  property.item.forEach((itemSchema) => {
    const itemElement = createElement(itemSchema);
    if (itemElement) {
      container.appendChild(itemElement);
    }
  });
  return container;
};

/**
 * Creates an "Add" button for adding new array items.
 * @param {Object} property - The property object representing the array.
 * @returns {HTMLButtonElement} - The "Add" button element.
 */
const createAddButton = (property) => {
  const addButton = document.createElement("button");
  addButton.textContent = "Add";
  addButton.classList.add("btn", "btn-primary");
  addButton.addEventListener("click", () => {
    const itemSchema = property.item[0]; // Assuming all items have the same schema
    const itemElement = createElement(itemSchema);
    if (itemElement) {
      const container = addButton.parentNode;
      container.insertBefore(itemElement, addButton);
    }
  });
  return addButton;
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
 * Creates an input element with the given name and type.
 * @param {string} name - The name attribute of the input.
 * @param {string} type - The type attribute of the input.
 * @returns {HTMLInputElement} - The created input element.
 */
const createInput = (name, type) => {
  const input = document.createElement("input");
  input.setAttribute("name", name);
  input.classList.add("form-control");
  input.setAttribute("type", type);
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
    data[key].push(value);
  });
  console.log(data);
};

// Immediately fetch data upon script execution
fetchData();


 
