const doc = document.getElementById("org-title");
const org_change = document.getElementById("org-change");
doc.onclick = function () {
    org_change.style.removeProperty("display");
    document.querySelector(".leaderboard").classList.add("blur");
    console.log(doc.innerText)
}


function availableLeagues() {
    fetch(`${link}/availableLeagues`)
    .then(response => response.text())
    .then(async (data) => {
        console.log(data)
    })
}

window.onload = availableLeagues