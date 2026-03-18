"use strict";

/*
Author: Arnett, Jeremy
FORMAT - Shift + ALT + F to format
*/
var currentFish;
var relatedFish = [];
var hemisphere = 'NH';
var activeHemisphere = 'active_months_NH'
var selectedMonth;
var monthPool = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var timePool = [0, 0, 0, 0];
const monthEnum = {
    1: 'Jan',
    2: 'Feb',
    3: 'Mar',
    4: 'Apr',
    5: 'May',
    6: 'Jun',
    7: 'Jul',
    8: 'Aug',
    9: 'Sep',
    10: 'Oct',
    11: 'Nov',
    12: 'Dec'
};
const timeslots = [[1, 2, 3], [1, 2, 4], [1, 3], [2, 4], [1, 2, 3, 4]];


populateFish();


//retrieves all of the data and builds all of the tables when clicking submit
document.getElementById("fishFinder").addEventListener('submit', function (event) {
    event.preventDefault();

    var fish = document.getElementById("selectedFish").value;

    document.getElementById("selectedFish").value = "";

    fetch('/searchFish/' + fish)
        .then(response => {
            if (!response.ok) {
                throw new Error('response was not ok');
            }
            return response.json();
        })
        .then(data => {

            currentFish = data[0];
            var monthString = currentFish[activeHemisphere];
            //change from comma separated number string into an array of numbers
            currentFish.active_months_NH = currentFish.active_months_NH.split(",").map(num => parseInt(num, 10));
            currentFish.active_months_SH = currentFish.active_months_SH.split(",").map(num => parseInt(num, 10));

            buildFishDetailsTables();

            //retrieve related fish after the current fish details have been aquired
            const json = {
                hemisphere: hemisphere,
                location: currentFish.location,
                months: monthString,
                time: currentFish.active_time,
                time2: currentFish.active_time_alt
            }
            var jsonString = Object.keys(json).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(json[key]))
            .join('&');
            const url = "/relatedFish?" + jsonString;
            return fetch(url);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('response was not ok');
            }
            return response.json();
        })
        .then(data => {
            //remove current fish from related fish data
            relatedFish = data.filter(item => item.id !== currentFish.id);

            relatedFish.forEach(fish => {
                fish[activeHemisphere] = fish[activeHemisphere].split(",").map(num => parseInt(num, 10));
            });

            buildRelatedFishTable(relatedFish);
            buildFishSharedMonthsTable(relatedFish);
        })
        .catch(error => {
            console.log('Error: ', error)
        })
})

//resets active month table colors and changes selected months, then calls build time table
function selectMonth(row, x) {
    for (var i = 0; i < row.cells.length; i++) {
        if (currentFish[activeHemisphere].includes(i + 1)) {
            row.cells[i].classList.add('active');
        } else {
            row.cells[i].classList.remove();
        }
    }
    row.cells[x].classList.add('selected');
    selectedMonth = x + 1;
    buildFishSharedTimesTable();
}

//builds details table and active months table
function buildFishDetailsTables() {

    var tablebody = document.getElementById("fishDetailsTable");
    tablebody.innerHTML = '<tr><th>Name</th><th>Size</th><th>Location</th><th>Active Time</th><th>Active Time Alt</th></tr>';
    var row = tablebody.insertRow();

    row.insertCell().textContent = currentFish.name;
    row.insertCell().textContent = currentFish.size;
    row.insertCell().textContent = currentFish.location;
    var times = formatTime(currentFish.active_time, currentFish.active_time_alt)
    row.insertCell().textContent = times[0];
    row.insertCell().textContent = times[1];

    tablebody = document.getElementById("fishMonthsTable");
    tablebody.innerHTML = "<tr><caption>Active Months</caption></tr>";
    row = tablebody.insertRow();
    var i = 1;
    var cell = row.insertCell()
    cell.textContent = monthEnum[i++];
    //only add event if current fish is active in that month
    if (currentFish[activeHemisphere].includes(i)) {
        cell.addEventListener('click', function (event) {
            selectMonth(row, 0);
        })
    }
    cell = row.insertCell()
    cell.textContent = monthEnum[i++];
    if (currentFish[activeHemisphere].includes(i)) {
        cell.addEventListener('click', function (event) {
            selectMonth(row, 1);
        })
    }
    cell = row.insertCell()
    cell.textContent = monthEnum[i++];
    if (currentFish[activeHemisphere].includes(i)) {
        cell.addEventListener('click', function (event) {
            selectMonth(row, 2);
        })
    }
    cell = row.insertCell()
    cell.textContent = monthEnum[i++];
    if (currentFish[activeHemisphere].includes(i)) {
        cell.addEventListener('click', function (event) {
            selectMonth(row, 3);
        })
    }
    cell = row.insertCell()
    cell.textContent = monthEnum[i++];
    if (currentFish[activeHemisphere].includes(i)) {
        cell.addEventListener('click', function (event) {
            selectMonth(row, 4);
        })
    }
    cell = row.insertCell()
    cell.textContent = monthEnum[i++];
    if (currentFish[activeHemisphere].includes(i)) {
        cell.addEventListener('click', function (event) {
            selectMonth(row, 5);
        })
    }
    cell = row.insertCell()
    cell.textContent = monthEnum[i++];
    if (currentFish[activeHemisphere].includes(i)) {
        cell.addEventListener('click', function (event) {
            selectMonth(row, 6);
        })
    }
    cell = row.insertCell()
    cell.textContent = monthEnum[i++];
    if (currentFish[activeHemisphere].includes(i)) {
        cell.addEventListener('click', function (event) {
            selectMonth(row, 7);
        })
    }
    cell = row.insertCell()
    cell.textContent = monthEnum[i++];
    if (currentFish[activeHemisphere].includes(i)) {
        cell.addEventListener('click', function (event) {
            selectMonth(row, 8);
        })
    }
    cell = row.insertCell()
    cell.textContent = monthEnum[i++];
    if (currentFish[activeHemisphere].includes(i)) {
        cell.addEventListener('click', function (event) {
            selectMonth(row, 9);
        })
    }
    cell = row.insertCell()
    cell.textContent = monthEnum[i++];
    if (currentFish[activeHemisphere].includes(i)) {
        cell.addEventListener('click', function (event) {
            selectMonth(row, 10);
        })
    }
    cell = row.insertCell()
    cell.textContent = monthEnum[i++];
    if (currentFish[activeHemisphere].includes(i)) {
        cell.addEventListener('click', function (event) {
            selectMonth(row, 11);
        })
    }

    //color active months
    currentFish[activeHemisphere].forEach(month => {
        row.cells[month - 1].classList.add('active');
    });
}

//builds the related fish table
function buildRelatedFishTable(relatedFish) {
    var tablebody = document.getElementById("relatedFishTable");
    tablebody.innerHTML = '<tr><caption>Related Fish</caption></tr><tr><th>Name</th><th>Size</th><th>Location</th><th>Active Time</th><th>Active Time Alt</th></tr>';
    relatedFish.forEach(fish => {
        var row = tablebody.insertRow();
        row.insertCell().textContent = fish.name;
        row.insertCell().textContent = fish.size;
        row.insertCell().textContent = fish.location;
        var times = formatTime(fish.active_time, fish.active_time_alt)
        row.insertCell().textContent = times[0];
        row.insertCell().textContent = times[1];
    });
}

//builds the shared months table
function buildFishSharedMonthsTable(relatedFish) {
    monthPool = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var tablebody = document.getElementById("fishSharedMonthsTable");
    tablebody.innerHTML = "<tr><caption>Related Fish Active Months</caption></tr>";
    var row = tablebody.insertRow();
    var nameCell = row.insertCell()
    nameCell.textContent = currentFish.name;
    //if i dont set the width, it widens the name rather than keep all cells equal width
    nameCell.style.width = "15%";
    currentFish[activeHemisphere].forEach(month => {
        row.insertCell().textContent = monthEnum[month];
    });

    var i = 1
    currentFish[activeHemisphere].forEach(month => {
        monthPool[month - 1]++;
        row.cells[i++].classList.add('active');
    });
    relatedFish.forEach(fish => {
        row = tablebody.insertRow();
        row.insertCell().textContent = fish.name;
        currentFish[activeHemisphere].forEach(month => {
            row.insertCell().textContent = monthEnum[month];
        });

        i = 1;
        currentFish[activeHemisphere].forEach(month => {
            if (fish[activeHemisphere].includes(month)) {
                monthPool[month - 1]++;
                row.cells[i].classList.add('active');
            }
            i++;
        });
    });
    row = tablebody.insertRow();
    row.insertCell().textContent = "fish in pool";
    currentFish[activeHemisphere].forEach(month => {
        row.insertCell().textContent = monthPool[month - 1];
    });
}

//builds the shared time table based on the selected month
function buildFishSharedTimesTable() {
    timePool = [0, 0, 0, 0];
    var tableBody = document.getElementById("fishSharedTimesTable");
    tableBody.innerHTML = "<tr><caption>Selected Month Time Table (lines between the cells are the times)</caption></tr><tr><th>name</th><th>&lt;-4AM</th><th>&lt;-9AM</th><th>&lt;-4PM</th><th>&lt;-9PM</th>";

    var row = tableBody.insertRow();
    createTimeCells(row, currentFish);
    if (currentFish.active_time_alt != 0) {
        row = tableBody.insertRow();
        createTimeCells(row, currentFish, true);
    }

    relatedFish.forEach(fish => {
        if (fish[activeHemisphere].includes(selectedMonth)) {
            row = tableBody.insertRow();
            createTimeCells(row, fish);
            if (fish.active_time_alt != 0) {
                row = tableBody.insertRow();
                createTimeCells(row, fish, true);
            }
        }
    });
    //totals row
    row = tableBody.insertRow();
    row.insertCell().textContent = "fish in pool";
    row.insertCell().textContent = timePool[0];
    row.insertCell().textContent = timePool[1];
    row.insertCell().textContent = timePool[2];
    row.insertCell().textContent = timePool[3];
}

//create and shade the cells for each row
//used by buildFishSharedTimesTable
function createTimeCells(row, fish, alt = false) {
    var time = 'active_time';
    if (alt) {
        time = 'active_time_alt';
    }
    var cell = row.insertCell()
    cell.textContent = fish.name;
    if (alt) {
        cell.textContent += " ALT";
    }
    cell = row.insertCell();
    if (fish[time] == 1 || fish[time] == 2) {
        cell.classList.add('active');
        timePool[0]++;
    }
    cell = row.insertCell();
    if (fish[time] == 1 || fish[time] == 3) {
        cell.classList.add('active');
        timePool[1]++;
    }
    cell = row.insertCell();
    if (fish[time] == 1 || fish[time] == 2) {
        cell.classList.add('active');
        timePool[2]++;
    }
    cell = row.insertCell();
    if (fish[time] == 2 || fish[time] == 4) {
        cell.classList.add('active');
        timePool[3]++;
    }
    if (fish[time] == 5) {
        for (var x = 1; x < row.cells.length; x++) {
            row.cells[x].classList.add('active');
        }
        timePool[0]++;
        timePool[1]++;
        timePool[2]++;
        timePool[3]++;
    }
}

//formats timeslots to display on table
function formatTime(T1, T2) {
    var times = [];
    if (T2 == 5) {
        //either cherry salmon or char have an all day alt time that changes based on hemisphere
        times.push("4PM-9AM (NH: Mar-Jun, SH: Sep-Dec)");
        times.push("All Day (NH: Sep-Nov, SH: Mar-May)");
        return times;
    }

    if (T1 == 5) {
        //all day means there is no alt time
        times.push("All Day");
        times.push("N/A");
        return times;
    }

    switch (T1) {
        case 1:
            times.push("4 AM - 9 PM");
            break;
        case 2:
            times.push("4 PM - 9 AM");
            break;
        case 3:
            times.push("9 AM - 4 PM");
            break;
        case 4:
            times.push("9 PM - 4 AM");
            break;
        default:
            times.push("an error occurred");
            break;
    }

    //piranha is the only fish with an actual alt time of 9PM-4AM
    switch (T2) {
        case 0:
            times.push("N/A");
            break;
        case 4:
            times.push("9 PM - 4 AM");
            break;
        default:
            times.push("an error occurred");
            break;
    }
    return times;
}

//populates the datalist for the selectedFish input
function populateFish() {
    fetch('/fishNames')
        .then(response => response.json())
        .then(data => {
            const FishList = document.getElementById('FishList');
            data.forEach(fish => {
                const option = document.createElement('option');
                option.value = `${fish.name}`;
                FishList.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching fish:', error));
}

//changes the active hemisphere based on the radio button
document.getElementById("NH").addEventListener('change', function (event) {
    if (document.getElementById("NH").checked) {
        hemisphere = 'NH';
        activeHemisphere = "active_months_" + hemisphere;
    }
})
document.getElementById("SH").addEventListener('change', function (event) {
    if (document.getElementById("SH").checked) {
        hemisphere = 'SH';
        activeHemisphere = "active_months_" + hemisphere;
    }
})