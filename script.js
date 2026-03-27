let text = "AI/ML Engineer | Time Series Specialist 🚀";
let i = 0;

function typing() {
    if (i < text.length) {
        document.getElementById("typing").innerHTML += text.charAt(i);
        i++;
        setTimeout(typing, 50);
    }
}
window.onload = typing;

function filterProjects(category) {
    let cards = document.getElementsByClassName("card");
    for (let card of cards) {
        if (category === "all") {
            card.style.display = "block";
        } else {
            if (card.classList.contains(category)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        }
    }
}
