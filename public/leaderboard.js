async function loadLeaderboard() {

    const response = await fetch("/leaderboard");

    const participants = await response.json();

    let html = `
        <div class="leaderboard-table">
            <table>

                <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>College</th>
                    <th>Event</th>
                    <th>Score</th>
                </tr>
    `;

    participants.forEach((participant, index) => {

        html += `
            <tr>
                <td>${index + 1}</td>
                <td>${participant.name}</td>
                <td>${participant.college}</td>
                <td>${participant.event}</td>
                <td>${participant.score}</td>
            </tr>
        `;

    });

    html += `
            </table>
        </div>
    `;

    document.getElementById("leaderboard").innerHTML = html;
}