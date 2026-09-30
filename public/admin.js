// ================= CHECK ADMIN LOGIN =================

async function checkAdminLogin() {

    const response = await fetch("/check-admin");

    if (response.status === 401) {
        alert("Please login as admin first.");
        window.location.href = "/login.html";
    }

}

checkAdminLogin();
// ================= DASHBOARD STATS =================

async function loadStats() {

    const response = await fetch("/stats");

    const stats = await response.json();

    document.getElementById("totalParticipants").textContent =
        stats.totalParticipants;

    document.getElementById("totalEvents").textContent =
        stats.totalEvents;

    document.getElementById("highestScore").textContent =
        stats.highestScore;

    document.getElementById("averageScore").textContent =
        Number(stats.averageScore).toFixed(2);
}


// Load statistics when page opens
loadStats();
// ================= LOAD PARTICIPANTS =================

async function loadParticipants() {

    const response = await fetch("/participants");

    if (response.status === 401) {
        alert("Please login as admin first.");
        window.location.href = "/login.html";
        return;
    }

    const participants = await response.json();

    const searchText = document
        .getElementById("search")
        .value
        .toLowerCase();

    const filteredParticipants = participants.filter(participant =>
        participant.name.toLowerCase().includes(searchText) ||
        participant.email.toLowerCase().includes(searchText) ||
        participant.college.toLowerCase().includes(searchText) ||
        participant.event.toLowerCase().includes(searchText)
    );


    let html = `
        <div class="table-container">

        <table>

            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>College</th>
                <th>Event</th>
                <th>Score</th>
                <th>Actions</th>
            </tr>
    `;


    if (filteredParticipants.length === 0) {

        html += `
            <tr>
                <td colspan="7">
                    No participants found.
                </td>
            </tr>
        `;

    } else {

        filteredParticipants.forEach(participant => {

            html += `
                <tr>

                    <td>${participant.id}</td>

                    <td>${participant.name}</td>

                    <td>${participant.email}</td>

                    <td>${participant.college}</td>

                    <td>${participant.event}</td>

                    <td>

                        <input
                            type="number"
                            id="score-${participant.id}"
                            value="${participant.score}"
                            min="0"
                        >

                    </td>

                    <td>

                        <button
                            onclick="updateScore(${participant.id})">
                            Update
                        </button>

                        <button
                            class="delete-btn"
                            onclick="deleteParticipant(${participant.id})">
                            Delete
                        </button>

                    </td>

                </tr>
            `;
        });
    }


    html += `
        </table>

        </div>
    `;


    document.getElementById("participants").innerHTML = html;
}



// ================= UPDATE SCORE =================

async function updateScore(id) {

    const score =
        document.getElementById(`score-${id}`).value;


    if (score === "" || score < 0) {

        alert("Please enter a valid score.");

        return;
    }


    const response = await fetch(`/update-score/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            score: score
        })

    });


    const result = await response.text();

    alert(result);

    loadParticipants();
}



// ================= DELETE PARTICIPANT =================

async function deleteParticipant(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this participant?");


    if (!confirmDelete) {
        return;
    }


    const response =
        await fetch(`/delete-participant/${id}`, {

            method: "DELETE"

        });


    const result = await response.text();

    alert(result);

    loadParticipants();
}



// ================= LIVE SEARCH =================

document
    .getElementById("search")
    .addEventListener("input", function() {

        loadParticipants();

    });
    // ================= EVENT MANAGEMENT =================
async function loadEvents() {

    const response = await fetch("/admin/events");

    if (response.status === 401) {
        alert("Please login as admin first.");
        window.location.href = "/login.html";
        return;
    }

    const events = await response.json();

    let html = `
        <h2>⚡ Manage Events</h2>

        <div class="event-form">

            <input
                type="text"
                id="eventName"
                placeholder="Event name"
            >

            <input
                type="text"
                id="eventDescription"
                placeholder="Event description"
            >

            <input
                type="date"
                id="eventDate"
            >

            <input
                type="text"
                id="eventVenue"
                placeholder="Venue"
            >

            <button onclick="addEvent()">
                Add Event
            </button>

        </div>

        <div class="event-list">
    `;

    events.forEach(event => {

        html += `
            <div class="event-admin-card">

                <h3>${event.name}</h3>

                <p>${event.description}</p>

                <p>
                    📅 ${new Date(event.event_date).toLocaleDateString()}
                </p>

                <p>
                    📍 ${event.venue}
                </p>

                <button
                    class="delete-btn"
                    onclick="deleteEvent(${event.id})">
                    Delete
                </button>

            </div>
        `;
    });

    html += `
        </div>
    `;

    document.getElementById("events").innerHTML = html;
}


// ================= ADD EVENT =================

async function addEvent() {

    const name =
        document.getElementById("eventName").value;

    const description =
        document.getElementById("eventDescription").value;

    const event_date =
        document.getElementById("eventDate").value;

    const venue =
        document.getElementById("eventVenue").value;


    if (!name || !description || !event_date || !venue) {

        alert("Please fill all event details.");

        return;
    }


    const response = await fetch("/events", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            name,
            description,
            event_date,
            venue
        })

    });


    const result = await response.text();

    alert(result);

    loadEvents();
}


// ================= DELETE EVENT =================

async function deleteEvent(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this event?");


    if (!confirmDelete) {
        return;
    }


    const response =
        await fetch(`/events/${id}`, {

            method: "DELETE"

        });


    const result = await response.text();

    alert(result);

    loadEvents();
}
// ================= ADMIN LOGOUT =================

async function logoutAdmin() {

    const response = await fetch("/logout");

    const result = await response.text();

    alert(result);

    window.location.href = "/login.html";
}

