let lastUsedIndex = 0; // To keep track of the last index used
let isInitialSubmit = true; // Flag to check if it's the first submit

// Function to handle form submission
function handleFormSubmission(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  // Create an object to store form data
  const user = {};
  formData.forEach((value, key) => {
    user[key] = value;
  });

  // Check if the phone number is valid
  if (!isValidPhoneNumber(user.phoneNumber)) {
    // Show the custom phone number validation error modal
    const phoneErrorModal = new bootstrap.Modal(
      document.getElementById("phoneErrorModal")
    );
    phoneErrorModal.show();

    // Clear the phone number input field
    form.elements["phoneNumber"].value = "";

    return;
  }

  // Send the form data to the server using a POST request
  fetch("/submit-form", {
    method: "POST",
    body: new URLSearchParams(formData),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        lastUsedIndex++;
        user.index = lastUsedIndex;
        if (isInitialSubmit) {
          // Replace the initial example row on the first submit
          replaceExampleRow(user);
          isInitialSubmit = false;
        } else {
          // Add a new row for subsequent submissions
          addNewRowToTable(user);
        }
        form.reset(); // Reset the form fields after submission
      }
    })
    .catch((error) => console.error("Error submitting form:", error));
}

function isValidPhoneNumber(phoneNumber) {
  // Regular expressions to match the valid phone number patterns
  const pattern1 = /^\d{3}-\d{3}-\d{4}$/;
  const pattern2 = /^\d{10}$/;

  return pattern1.test(phoneNumber) || pattern2.test(phoneNumber);
}

function addNewRowToTable(user) {
  const tableBody = document.getElementById("userTableBody");

  const newRow = document.createElement("tr");
  const indexCell = document.createElement("th");
  const firstNameCell = document.createElement("td");
  const lastNameCell = document.createElement("td");
  const phoneNumberCell = document.createElement("td");

  indexCell.textContent = user.index;
  firstNameCell.textContent = user.firstName;
  lastNameCell.textContent = user.lastName;
  phoneNumberCell.textContent = formatPhoneNumber(user.phoneNumber);

  newRow.appendChild(indexCell);
  newRow.appendChild(firstNameCell);
  newRow.appendChild(lastNameCell);
  newRow.appendChild(phoneNumberCell);

  tableBody.appendChild(newRow);
}

function replaceExampleRow(user) {
  const tableBody = document.getElementById("userTableBody");
  const exampleRow = tableBody.firstElementChild;
  const cells = exampleRow.querySelectorAll("td");

  cells[0].textContent = user.index;
  cells[0].textContent = user.firstName;
  cells[1].textContent = user.lastName;
  cells[2].textContent = formatPhoneNumber(user.phoneNumber);
}

function formatPhoneNumber(phoneNumber) {
  // Format phone number as ddd-ddd-dddd
  return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
}

// Function to add the example row initially
function addExampleRow(index, firstName, lastName, phoneNumber) {
  const tableBody = document.getElementById("userTableBody");
  const exampleRow = document.createElement("tr");
  const indexCell = document.createElement("th");
  const firstNameCell = document.createElement("td");
  const lastNameCell = document.createElement("td");
  const phoneNumberCell = document.createElement("td");

  indexCell.textContent = index;
  firstNameCell.textContent = firstName;
  lastNameCell.textContent = lastName;
  phoneNumberCell.textContent = formatPhoneNumber(phoneNumber);

  exampleRow.appendChild(indexCell);
  exampleRow.appendChild(firstNameCell);
  exampleRow.appendChild(lastNameCell);
  exampleRow.appendChild(phoneNumberCell);

  tableBody.appendChild(exampleRow);
}

// Call the function to add the example row initially with the initial values
addExampleRow(1, "Let's", "Play", "Together");

// Add event listener to the form submission
document
  .getElementById("userForm")
  .addEventListener("submit", handleFormSubmission);

// Function to fetch and insert the content of navbar.html
function insertNavbarContent() {
  fetch("navbar.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("navbar-container").innerHTML = data;
    })
    .catch((error) => console.error("Error fetching navbar:", error));
}

// Call the function to insert the navbar content
insertNavbarContent();
