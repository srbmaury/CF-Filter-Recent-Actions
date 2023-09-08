function populateBody() {
    chrome.storage.local.get(['rating', 'atLeast50', 'blogIds'], function (result) {
        if (!chrome.runtime.lastError && result.rating !== undefined) {
            const savedRating = result.rating;
            const currentMinimumDiv = document.getElementById('currentMinimum');
            const blogIdsInput = document.getElementById('blogIdsInput');
            
            if(savedRating){
                document.getElementById('minimumRatingInput').value = savedRating;
            }

            if (result.atLeast50 === true) document.getElementById('atLeast50').checked = true;

            if (result.blogIds && result.blogIds.length > 0) {
                blogIdsInput.value = result.blogIds.join(', ');
            }
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
    var blogIds = document.getElementById('blogIdsInput').value
        .split(',')
        .map(id => id.trim());

    if (isNaN(rating) || rating < 0 || rating > 4000) {
        showAlert("Rating must be between 0 and 4000.");
        return;
    }

    chrome.storage.local.set({ rating: rating, atLeast50: atLeast50, blogIds: blogIds }, function () {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            alert("Error: Unable to save rating and blog IDs");
        } else {
            document.getElementById("savedMessage").style.display = "block";
        }
    });
});
