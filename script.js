const text = " Data Scientist | AI/ML Engineer | Time Series Specialist 🚀";
let i = 0;

function typingEffect() {
    const el = document.getElementById("typing");
    if (!el) return;
    if (i === 0) el.innerHTML = "";
    if (i < text.length) {
        el.innerHTML += text.charAt(i);
        i++;
        setTimeout(typingEffect, 60);
    }
}

function filterProjects(category) {
    const cards = document.querySelectorAll(".card");
    const buttons = document.querySelectorAll(".filters button");

    buttons.forEach(btn => {
        btn.classList.remove("active");
        const btnText = btn.innerText.toLowerCase();
        if(btnText.includes(category) || (category === 'all' && btnText.includes('all'))) {
            btn.classList.add("active");
        }
    });

    cards.forEach(card => {
        if (category === "all" || card.classList.contains(category)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

function openModal() { document.getElementById("contactModal").style.display = "block"; }
function closeModal() { document.getElementById("contactModal").style.display = "none"; }

window.onclick = function(event) {
    let modal = document.getElementById("contactModal");
    if (event.target == modal) { modal.style.display = "none"; }
}

document.addEventListener("DOMContentLoaded", typingEffect);
