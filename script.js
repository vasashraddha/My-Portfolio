/* ========================= */
/* Typing Effect */
/* ========================= */

const text = "AI/ML Engineer | Time Series Specialist 🚀";
let i = 0;

function typingEffect() {
    const el = document.getElementById("typing");

    // Safety check (prevents errors if element missing)
    if (!el) return;

    // Clear text on first run (prevents duplication)
    if (i === 0) {
        el.innerHTML = "";
    }

    if (i < text.length) {
        el.innerHTML += text.charAt(i);
        i++;
        setTimeout(typingEffect, 50);
    }
}

/* Run after DOM loads (safer than window.onload) */
document.addEventListener("DOMContentLoaded", typingEffect);


/* ========================= */
/* Project Filter */
/* ========================= */

function filterProjects(category) {
    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        if (category === "all" || card.classList.contains(category)) {
            card.style.display = "block";  // show
        } else {
            card.style.display = "none";   // hide
        }
    });
}


/* ========================= */
/* Optional: Active Button Highlight */
/* ========================= */

const buttons = document.querySelectorAll(".filters button");

buttons.forEach(btn => {
    btn.addEventListener("click", function () {

        // Remove active class from all
        buttons.forEach(b => b.classList.remove("active"));

        // Add active to clicked
        this.classList.add("active");
    });
});
