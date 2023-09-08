var rating, atLeast50;
var blogIds = [];
var processedAuthors = new Set();
var processedBlogIds = new Set();
var elementCount = 0;

chrome.storage.local.get(['rating', 'atLeast50', 'blogIds'], function (result) {
    if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
    } else {
        rating = result.rating || 0;
        atLeast50 = result.atLeast50 || false;
        if(result.blogIds){
            blogIds = result.blogIds;
        }
        document.querySelector('.recent-actions').parentElement.firstChild.nextSibling.innerHTML += `<span style="font-size:10px; float:right; margin-right:10px; margin-top:5px;">rating >= ${rating}, ${atLeast50.toString().toUpperCase()[0]}</span>`;
        fetchData();
    }
});

function getClassNameByRank(rank) {
    const rankToClassName = {
        "legendary grandmaster": "rated-user user-legendary",
        "international grandmaster": "rated-user user-red",
        "grandmaster": "rated-user user-red",
        "international master": "rated-user user-orange",
        "master": "rated-user user-orange",
        "candidate master": "rated-user user-violet",
        "expert": "rated-user user-blue",
        "specialist": "rated-user user-cyan",
        "pupil": "rated-user user-green",
        "newbie": "rated-user user-gray",
        "unrated": "rated-user user-black",
        "headquarters": "rated-user user-admin",
    };

    return rankToClassName[rank.toLowerCase()] || "";
}

function getRankTitle(rank) {
    const words = rank.split(" ");
    const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    return capitalizedWords.join(" ");
}

async function fetchUserDetails(handles) {
    const userInfoResponse = await fetch(`https://codeforces.com/api/user.info?handles=${handles}`);
    const userInfoData = await userInfoResponse.json();
    return userInfoData.result;
}

const specialHandles = new Set(["MikeMirzayanov", "Una_Shem", "atcoder_official", "CodeChef_admin", "ICPCNews"]);

async function fetchData() {
    try {
        const response = await fetch("https://codeforces.com/api/recentActions?maxCount=100");
        const data = await response.json();

        const recentActionsElement = document.querySelector('.recent-actions ul');
        recentActionsElement.innerHTML = "";

        const handlesToFetch = [];

        for (const entry of data.result) {
            const authorHandle = entry.blogEntry.authorHandle;
            const blogId = entry.blogEntry.id;

            if (processedAuthors.has(authorHandle) || processedBlogIds.has(blogId)) {
                continue;
            }

            processedAuthors.add(authorHandle);
            processedBlogIds.add(blogId);

            handlesToFetch.push(authorHandle);
        }

        const userInfoData = await fetchUserDetails(handlesToFetch.join(';'));
        processedBlogIds.clear();

        for (const entry of data.result) {
            if (elementCount >= 25) {
                break;
            }
            const authorHandle = entry.blogEntry.authorHandle;
            const blogId = entry.blogEntry.id;
            const blogRating = entry.blogEntry.rating;
            const creationTimeInSeconds = entry.blogEntry.creationTimeSeconds;
            const currentTimeInSeconds = Math.floor(Date.now() / 1000);
            const timeDifferenceInSeconds = currentTimeInSeconds - creationTimeInSeconds;
            const daysDifference = Math.floor(timeDifferenceInSeconds / (3600 * 24));

            if (blogIds.includes(blogId.toString()) || processedBlogIds.has(blogId)) continue;
            processedBlogIds.add(blogId);
            const userData = userInfoData.find(user => user.handle === authorHandle);
            if (userData && (specialHandles.has(userData.handle) || userData.rating >= rating || (atLeast50 && blogRating >= 50))) {
                let rank = userData.rank || "unrated";
                if (authorHandle == "MikeMirzayanov" || authorHandle == "Una_Shem") rank = "headquarters";

                let rankTitle = getRankTitle(rank);

                const liElement = document.createElement('li');
                liElement.innerHTML = `
                <div style="font-size:0.9em;padding:0.5em 0;">
                    <span style="display:inline">
                        <a href="/profile/${authorHandle}" title="${rankTitle}, ${authorHandle}" class="${getClassNameByRank(rank)}">${authorHandle}</a> →
                        <a href="/blog/entry/${blogId}">${entry.blogEntry.title.replace(/<p>/g, '').replace(/<\/p>/g, '')}</a>
                        &nbsp;&nbsp;${entry.comment !== undefined ? '<img alt="New comment(s)" title="New comment(s)" src="//codeforces.org/s/51792/images/icons/comment-12x12.png" style="vertical-align:middle;">' : '<img alt="Text created or updated" title="Text created or updated" src="//codeforces.org/s/51792/images/icons/x-update-12x12.png" style="vertical-align:middle;">'}
                        ${daysDifference > 56 ? '<img alt="Necropost" title="Necropost" src="//codeforces.org/s/51792/images/icons/hourglass.png" style="vertical-align:middle; position: relative; top: 1px;">' : ''}
                    </span>
                </div>
                `;
                recentActionsElement.appendChild(liElement);
                elementCount++;
            }
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}
