const express = require("express");
const session = require("express-session");
const db = require("./db");

const app = express();
// Session setup
app.use(session({
    secret: "technova-secret-key",
    resave: false,
    saveUninitialized: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
// Check if admin is logged in
function requireAdmin(req, res, next) {

    if (req.session.admin) {
        next();
    } else {
        res.status(401).send("Unauthorized. Please login first.");
    }

}
// Register a participant
app.post("/register", (req, res) => {
    const { name, email, college, event } = req.body;

    const sql = `
        INSERT INTO participants (name, email, college, event)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [name, email, college, event], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Registration failed");
        } else {
            res.send("Registration successful!");
        }
    });
});

// Get all participants
app.get("/participants", requireAdmin, (req, res) => {
    const sql = "SELECT * FROM participants";

    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send("Failed to fetch participants");
        } else {
            res.json(results);
        }
    });
});

// Update participant score
// ================= UPDATE PARTICIPANT SCORE =================

app.put("/update-score/:id", requireAdmin, (req, res) => {

    const { score } = req.body;
    const { id } = req.params;

    const sql = "UPDATE participants SET score = ? WHERE id = ?";

    db.query(sql, [score, id], (err, result) => {

        if (err) {
            console.log(err);
            res.status(500).send("Score update failed");
        } else {
            res.send("Score updated successfully!");
        }

    });

});

// Get leaderboard
app.get("/leaderboard", (req, res) => {
    const sql = `
        SELECT name, college, event, score
        FROM participants
        ORDER BY score DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send("Failed to fetch leaderboard");
        } else {
            res.json(results);
        }
    });
});
// ================= ADMIN LOGIN =================

app.post("/login", (req, res) => {

    const { username, password } = req.body;

    const sql = `
        SELECT * FROM admins
        WHERE username = ? AND password = ?
    `;

    db.query(sql, [username, password], (err, results) => {

        if (err) {

            console.log(err);
            res.status(500).send("Login failed");

        }

        else if (results.length > 0) {

            req.session.admin = true;

            res.send("Login successful!");

        }

        else {

            res.status(401).send("Invalid username or password");

        }

    });

});
// ================= EVENT APIs =================

// Get all events
app.get("/events", (req, res) => {

    const sql = "SELECT * FROM events ORDER BY event_date";

    db.query(sql, (err, results) => {

        if (err) {
            console.log(err);
            res.status(500).send("Failed to fetch events");
        } else {
            res.json(results);
        }

    });
    // Admin-only event list
app.get("/admin/events", requireAdmin, (req, res) => {

    const sql = "SELECT * FROM events ORDER BY event_date";

    db.query(sql, (err, results) => {

        if (err) {
            console.log(err);
            res.status(500).send("Failed to fetch events");
        } else {
            res.json(results);
        }

    });

});

});
// Admin-only event list
app.get("/admin/events", requireAdmin, (req, res) => {

    const sql = "SELECT * FROM events ORDER BY event_date";

    db.query(sql, (err, results) => {

        if (err) {
            console.log(err);
            res.status(500).send("Failed to fetch events");
        } else {
            res.json(results);
        }

    });

});

// Add a new event
app.post("/events", requireAdmin, (req, res) => {

    const { name, description, event_date, venue } = req.body;

    const sql = `
        INSERT INTO events (name, description, event_date, venue)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [name, description, event_date, venue],
        (err, result) => {

            if (err) {
                console.log(err);
                res.status(500).send("Failed to add event");
            } else {
                res.send("Event added successfully!");
            }

        }
    );

});


// ================= DELETE PARTICIPANT =================

app.delete("/delete-participant/:id", requireAdmin, (req, res) => {

    const { id } = req.params;

    const sql = "DELETE FROM participants WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {

            console.log(err);
            res.status(500).send("Failed to delete participant");

        }

        else if (result.affectedRows === 0) {

            res.status(404).send("Participant not found");

        }

        else {

            res.send("Participant deleted successfully!");

        }

    });

});


// ================= DELETE EVENT =================

app.delete("/events/:id", requireAdmin, (req, res) => {

    const { id } = req.params;

    const sql = "DELETE FROM events WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {

            console.log(err);
            res.status(500).send("Failed to delete event");

        }

        else if (result.affectedRows === 0) {

            res.status(404).send("Event not found");

        }

        else {

            res.send("Event deleted successfully!");

        }

    });

});
// ================= ADMIN LOGOUT =================

app.get("/logout", (req, res) => {

    req.session.destroy((err) => {

        if (err) {
            console.log(err);
            return res.status(500).send("Logout failed");
        }

        res.send("Logout successful!");
    });

});
// ================= CHECK ADMIN =================

app.get("/check-admin", (req, res) => {

    if (req.session.admin) {
        res.json({ loggedIn: true });
    } else {
        res.status(401).json({ loggedIn: false });
    }

});
// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});