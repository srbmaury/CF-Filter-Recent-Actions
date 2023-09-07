function populateBody() {
    chrome.storage.local.get(['rating', 'atLeast50'], function (result) {
        if (!chrome.runtime.lastError && result.rating !== undefined) {
            const savedRating = result.rating;
            const currentMinimumDiv = document.getElementById('currentMinimum');
            if (result.atLeast50 === true) document.getElementById('atLeast50').checked = true;
            currentMinimumDiv.textContent = `Current Minimum: ${savedRating}`;
        }
    });
}

function showAlert(message) {
    alert(message);
}

document.addEventListener('DOMContentLoaded', function () {
    populateBody();
});

document.getElementById('saveButton').addEventListener('click', function () {
    var rating = parseInt(document.getElementById('minimumRatingInput').value, 10);
    var atLeast50 = document.getElementById('atLeast50').checked;

    if (isNaN(rating) || rating < 0 || rating > 4000) {
        showAlert("Rating must be between 0 and 4000.");
        return;
    }

    chrome.storage.local.set({ rating: rating, atLeast50: atLeast50 }, function () {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            alert("Error: Unable to save rating");
        } else {
            const currentMinimumDiv = document.getElementById('currentMinimum');
            currentMinimumDiv.textContent = `Current Minimum: ${rating}`;
            document.getElementById("savedMessage").style.display = "block";
        }
    });
});