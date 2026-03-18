"use strict";

/*
Author: Arnett, Jeremy
FORMAT - Shift + ALT + F to format
*/

window.onload = function(){
    document.getElementById('name').focus();
}

document.getElementById("addFish").addEventListener('submit', function (event) {
    event.preventDefault();

    const newFish = {
        name: document.getElementById('name').value,
        size: document.getElementById('size').value,
        location: document.getElementById('location').value,
        activeTime: combineTimes(1),
        activeTimeAlt: combineTimes(2),
        NHmonths: getmonths("NH"),
        SHmonths: getmonths("SH")
    }

    fetch('/addFish',{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newFish)
    })
    .then(response => {
        if(!response.ok){
            throw new error('Network response was not OK');
        }
        return response.json();
    })
    .then(data => {
        console.log('Success: ', data.message);
        location.reload();
    })
    .catch(error => {
        console.error('Error: ',error);
    })

})

function combineTimes(num){
    var time = document.getElementById('startTime'+num).value + "-"+ document.getElementById('endTime'+num).value;
    return time;
}

function getmonths(h) {
    var months = "";
    for (var i = 1; i < 13; i++) {
        if(document.getElementById(h+i).checked){
            months += i+",";
        }
    }
    months = months.slice(0,-1);
    return months;
}