// Global state
let users = [];

// DOM Elements
const loadUsersBtn = document.getElementById("load-users");
const filterInput = document.getElementById("filter-input");
const statusText = document.getElementById("status");
const usersList = document.getElementById("users-list");

const API_URL = "https://jsonplaceholder.typicode.com/users";

/**
 * Renders an array of user objects to the DOM using createElement and textContent.
 * @param {Array} list - Array of user objects
 */
function renderUsers(list) {
  // Clear the existing list
  usersList.innerHTML = "";

  if (list.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.textContent = "No users match your filter.";
    usersList.appendChild(emptyItem);
    return;
  }

  list.forEach((user) => {
    const li = document.createElement("li");

    const nameHeading = document.createElement("strong");
    nameHeading.textContent = user.name;

    const detailsPara = document.createElement("p");
    detailsPara.textContent = `Email: ${user.email} | City: ${user.address?.city || "N/A"} | Company: ${user.company?.name || "N/A"}`;

    li.appendChild(nameHeading);
    li.appendChild(detailsPara);
    usersList.appendChild(li);
  });
}

/**
 * Fetches user data using async/await, try/catch/finally, and updates UI status.
 */
async function loadUsers() {
  loadUsersBtn.disabled = true;
  filterInput.disabled = true;
  statusText.textContent = "Loading users, please wait...";
  usersList.innerHTML = "";

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Server returned status code ${response.status}`);
    }

    const data = await response.json();
    users = data;

    renderUsers(users);
    statusText.textContent = `Successfully loaded ${users.length} users.`;
    filterInput.disabled = false;
    filterInput.value = "";
    filterInput.focus();
  } catch (error) {
    statusText.textContent = `Failed to load users: ${error.message}`;
    console.error("Fetch error:", error);
  } finally {
    loadUsersBtn.disabled = false;
  }
}

// Event Listeners
loadUsersBtn.addEventListener("click", loadUsers);

// Filter in real-time without dispatching new network requests
filterInput.addEventListener("input", (event) => {
  const query = event.target.value.trim().toLowerCase();
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(query)
  );
  renderUsers(filteredUsers);
});