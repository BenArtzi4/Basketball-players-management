// playersFunctions.js

// Function to fetch all players from the server and update the table
async function fetchPlayers() {
  try {
    const response = await fetch("/get-players");
    const data = await response.json();
    if (data.success) {
      const players = data.players;
      const tableBody = document.getElementById("userTableBody");
      tableBody.innerHTML = ""; // Clear existing rows
      players.forEach((player, index) => {
        const row = `<tr>
            <td>${index + 1}</td>
            <td>${player.firstName}</td>
            <td>${player.lastName}</td>
            <td>${player.phoneNumber}</td>
          </tr>`;
        tableBody.insertAdjacentHTML("beforeend", row);
      });
    }
  } catch (error) {
    console.error("Error fetching players:", error);
  }
}

// Function to check if the phone number is valid
function isValidPhoneNumber(phoneNumber) {
  const pattern1 = /^\d{3}-\d{3}-\d{4}$/;
  const pattern2 = /^\d{10}$/;
  return pattern1.test(phoneNumber) || pattern2.test(phoneNumber);
}

// Function to prompt for password and delete all players if password is correct
async function deletePlayers(password) {
  if (password !== null && password.trim() === "1234") {
    try {
      const response = await fetch("/delete-players", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }), // Send the password in the request body
      });
      const data = await response.json();

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: data.message,
        showConfirmButton: false,
        timer: 1500, // Auto-close the alert after 1.5 seconds
      });

      if (data.success) {
        // Fetch and update the table after successful deletion
        fetchPlayers();
      }
    } catch (error) {
      console.error("Error deleting players:", error);
    }
  } else {
    alert("Incorrect password. Players were not deleted.");
  }
}

export { fetchPlayers, deletePlayers, isValidPhoneNumber };
