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
        card.style.display = (category === "all" || card.classList.contains(category)) ? "block" : "none";
    }
}
