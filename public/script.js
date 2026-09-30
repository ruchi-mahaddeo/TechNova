async function showEvents() {

    const response = await fetch("/events");
    const events = await response.json();

    let html = "<h2>⚡ Available Events</h2>";

    events.forEach(event => {
        html += `
            <div class="event-card">
                <h3>${event.name}</h3>
                <p>${event.description}</p>
                <p>📅 ${new Date(event.event_date).toLocaleDateString()}</p>
                <p>📍 ${event.venue}</p>
            </div>
        `;
    });

    document.getElementById("events").innerHTML = html;
document.getElementById("events").scrollIntoView({
    behavior: "smooth"
});
}


// ================= REGISTRATION =================

async function openRegistration() {

    try {

        const response = await fetch("/events");
        const events = await response.json();

        let options = '<option value="">Select Event</option>';

        events.forEach(event => {

            options += `
                <option value="${event.name}">
                    ${event.name}
                </option>
            `;

        });


        document.getElementById("events").innerHTML = `

            <h2>📝 Event Registration</h2>

            <form id="registrationForm">

                <input
                    type="text"
                    id="name"
                    placeholder="Enter your name"
                    required
                >

                <br><br>

                <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    required
                >

                <br><br>

                <input
                    type="text"
                    id="college"
                    placeholder="Enter your college"
                    required
                >

                <br><br>

                <select id="event" required>
                    ${options}
                </select>

                <br><br>

                <button type="submit">
                    Submit Registration
                </button>

            </form>

        `;
        document.getElementById("events").scrollIntoView({
    behavior: "smooth"
});


        document
            .getElementById("registrationForm")
            .addEventListener("submit", async function(event) {

                event.preventDefault();


                const data = {

                    name: document.getElementById("name").value,

                    email: document.getElementById("email").value,

                    college: document.getElementById("college").value,

                    event: document.getElementById("event").value

                };


                const response = await fetch("/register", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(data)

                });


                const result = await response.text();

                alert(result);

            });

    }

    catch (error) {

        console.error(error);

        alert("Unable to load registration form.");

    }

}