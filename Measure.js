var to_id = "obheeflpdipmaefcoefhimnaihmhpkao";

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('files').addEventListener('change', handleFileSelect, false);
    document.getElementById('run').addEventListener('click', runMeasurement, false);
    document.getElementById('seconds').value = 10;
    document.getElementById('links').value = 0;
});

var urls;
var loadSeconds = 10;
var visitLinks = 0;

function handleFileSelect(evt) {
    // clear possible messages
    displayError(""); displaySuccess("");
    
    var files = evt.target.files;
    var f = files[0];
    
    // Only process text files.
    if (!f.type.match('text.*')) {
        displayError("Not a text file.");
        return;
    }
    
    var reader = new FileReader();
    
    // Closure to capture the file information.
    reader.onload = (function(theFile) {
        return function(e) {    
            parseFile(e.target.result);    
        };
    })(f);
    
    reader.readAsText(f);
}

function displayError(str) {
    document.getElementById("error").innerHTML = str;
}

function displaySuccess(str) {
    document.getElementById("success").innerHTML = str;
}

function parseFile(str) {
    urls = str.split('\n');
}

function setOptions() {
    var sec = document.getElementById('seconds').value;
    if (sec && sec > 0) {
        loadSeconds = sec;
    }
    
    var links = document.getElementById('links').value;
    if (links && links > 0) {
        visitLinks = links;
    }
}

function runMeasurement() {
    setOptions();
    
    chrome.runtime.sendMessage(to_id, {type : 'browseAutomatically', 
        urls : urls, loadtime : loadSeconds, visits : visitLinks},
        function(errorString) {
            if (errorString) {
                displayError(errorString);
            } else {
                displaySuccess("Automated measurement completed successfully!");
            }
        });
}


