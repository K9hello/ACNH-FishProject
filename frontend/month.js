"use strict";

/*
Author: Arnett, Jeremy
FORMAT - Shift + ALT + F to format
*/

var hemisphere = 'NH';
var riverFish = [], seaFish = [], pondFish = [];

//used for sorting by size
const sizeEnum = {
    'Tiny': 1,
    'Small': 2,
    'Medium': 3,
    'Large': 4,
    'Very Large': 5,
    'Very Large (Finned)': 6,
    'Long & Thin': 7,
    'Huge': 8
};

document.getElementById("monthFinder").addEventListener('submit', function (event) {

    event.preventDefault();
    var month = document.getElementById('selectedMonth').value;
    fetch('/monthFish/' + hemisphere + '/' + month)
        .then(response => {
            if (!response.ok) {
                throw new Error('response was not ok');
            }
            return response.json();
        })
        .then(data => {

            data.forEach(fish => {
                if (fish.location.includes('Sea')) {
                    seaFish.push(fish);
                } else if (fish.location.includes('River')) {
                    riverFish.push(fish);
                } else if (fish.location.includes('Pond')) {
                    pondFish.push(fish);
                } else {
                    throw error("Fish with wierd location");
                }
            });

            seaFish.sort((a, b) => {
                if (a.location == b.location) {
                    return sizeEnum[a.size] - sizeEnum[b.size];
                } else {
                    return a.location.localeCompare(b.location);
                }

            });
            riverFish.sort((a, b) => {
                if (a.location == b.location) {
                    return sizeEnum[a.size] - sizeEnum[b.size];
                } else {
                    return a.location.localeCompare(b.location);
                }

            });
            pondFish.sort((a, b) => sizeEnum[a.size] - sizeEnum[b.size]);

            buildTable(pondFish, 'pond');
            buildTable(riverFish, 'river');
            buildTable(seaFish, 'sea');
        })
})

function buildTable(fishes, tableName) {
    const tablebody = document.getElementById(tableName + 'Table');
    tablebody.innerHTML = '<tr><caption>' + tableName + ' fish</caption></tr><tr><th>Name</th><th>Size</th><th>Location</th><th>Active Time</th><th>Active Time Alt</th></tr>';

    var row;
    fishes.forEach(fish => {
        row = tablebody.insertRow();

        row.insertCell().textContent = fish.name;
        row.insertCell().textContent = fish.size;
        row.insertCell().textContent = fish.location;
        var times = formatTime(fish.active_time, fish.active_time_alt)
        row.insertCell().textContent = times[0];
        row.insertCell().textContent = times[1];
    });

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

//changes the active hemisphere based on the radio button
document.getElementById("NH").addEventListener('change', function (event) {
    if (document.getElementById("NH").checked) {
        hemisphere = 'NH';
        //activeHemisphere = "active_months_" + hemisphere;
    }
})
document.getElementById("SH").addEventListener('change', function (event) {
    if (document.getElementById("SH").checked) {
        hemisphere = 'SH';
        //activeHemisphere = "active_months_" + hemisphere;
    }
})