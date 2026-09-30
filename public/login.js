document.getElementById("loginForm").addEventListener("submit", async function(event) {

    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    });

    const result = await response.text();

    if (response.ok) {
        alert(result);
        window.location.href = "/admin.html";
    } else {
        alert(result);
    }

});