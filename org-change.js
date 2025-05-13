const doc = document.getElementById("org-title");
const org_change = document.querySelector(".org-menu");
doc.onclick = showMenu;
let linko = "http://192.168.2.12:8080"//"https://mikenug-server-new.onrender.com";

function showMenu() {
    // org_change.style.removeProperty("display");
    document.querySelector(".leaderboard").classList.add("blur");
    document.querySelector(".notification-button").classList.add("blur");
    $(".org-menu").fadeIn("fast");
    setTimeout(() => {
        document.addEventListener("click", outsideCheck);
    }, 500);
}

function outsideCheck(e) {
    if (e.target.nodeName === "BODY") {
        closeMenu();
        document.removeEventListener("click", outsideCheck);
    };
}

function changeLeague(e) {
    const svg = doc.getElementsByTagName("svg")[0].outerHTML;
    const orgName = e.target.textContent;
    //close menu
    closeMenu();
    document.removeEventListener("click", outsideCheck);
    console.log(orgName)
    console.log(doc.dataset.name)
    if (orgName !== doc.dataset.name) {
            document.querySelector(".leaderboard-container").innerHTML = `
                <div class="leaderboard-header">
                <span class="rank">#</span>
                <span class="name">Team</span>
                <span class="wins">W</span>
                <span class="draws">D</span>
                <span class="losses">L</span>
                <span class="gd">GD</span>
                <span class="points">Pts</span>
            </div>

            <!-- Skeleton loading state -->
            <div class="leaderboard-row skeleton"></div>
            <div class="leaderboard-row skeleton"></div>
            <div class="leaderboard-row skeleton"></div>
            <div class="leaderboard-row skeleton"></div>
            <div class="leaderboard-row skeleton"></div>`
        doc.innerHTML = `${svg} ${orgName.split("2")[0]}`;
        doc.dataset.name = orgName;
        setTimeout(() => {
        fetch(`${linko}/getLeague`)
            .then(response => response.text())
            .then(async (data) => {
                                    //load stats
        document.querySelector(".leaderboard-container").innerHTML = `
                                    <div class="leaderboard-header">
                    <span class="rank">#</span>
                    <span class="name">Team</span>
                    <span class="wins">W</span>
                    <span class="draws">D</span>
                    <span class="losses">L</span>
                    <span class="gd">GD</span>
                    <span class="points">Pts</span>
                </div>
                    `
                const json = JSON.parse(data)[orgName];
                for (let index = 0; index < Object.keys(json).length; index++) {
                    const element = Object.values(json)[index];
                    let rank = "";
                    if (index === 0) {
                        rank = "first"
                    } else if (index === 1) {
                        rank = "second"
                    } else if (index === 2) {
                        rank = "third"
                    } else if (index === 3) {
                        rank = "fourth"
                    }
                    console.log(rank)
                    let row = document.createElement("div")
                    row.classList = `leaderboard-row ${rank}`;
                    row.id = `${element.name.toLowerCase().split(" ")[0]}`;
                    row.innerHTML = `
                    <span class="rank">${index + 1}</span>
                    <span class="name">
                        <img src="${element.image.replaceAll("\"", "")}" class="profile-img">
                        ${element.name.firstUpper()}
                    </span>
                    <span class="wins">${element.wins}</span>
                    <span class="draws">${element.draws}</span>
                    <span class="losses">${element.looses}</span>
                    <span class="gd">${element.goalDifference}</span>
                    <span class="points">${element.points}</span>`
                    document.querySelector(".leaderboard-container").appendChild(row)
                }
            });
        }, 250);
            localStorage.setItem("lastOrg", orgName)
    }
}
function closeMenu() {
        $(".org-menu").fadeOut(150);
    document.querySelector(".leaderboard").classList.remove("blur");
    document.querySelector(".notification-button").classList.remove("blur");
}


function availableLeagues() {
    fetch(`${linko}/availableLeagues`)
        .then(response => response.text())
        .then(async (data) => {

            JSON.parse(data).forEach(org => {
                let element = document.createElement("button");
                element.className = "value";
                element.innerHTML = `${org}`;
                element.onclick = changeLeague;
                org_change.appendChild(element)
            });
        });
}

// window.onload = availableLeagues