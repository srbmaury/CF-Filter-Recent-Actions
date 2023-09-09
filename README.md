# CF Filter Recent Actions Extension

### Description

Are you tired of seeing useless blogs from low-rated users in Recent Actions?

Enhance your Codeforces experience with CF Filter Recent Actions. Retrieve and display blog entries exclusively from Codeforces users with a rating >= a specified minimum rating or if the blog rating is >= 50.

<img src="https://codeforces.com/predownloaded/88/5d/885de82af06f4dc5b044a5f707b06d865b16ea04.png">

### Installation

1. Clone or download [this](https://github.com/srbmaury/CF-Filter-Recent-Actions) repository.
2. Open the extensions page (chrome://extensions/) for Chrome or (edge://extensions/) for Edge.
3. Enable "Developer mode."
4. Click "Load unpacked" and select the extension folder.

### Usage

1. Click the extension icon in your Chrome/Edge toolbar.
2. Set the minimum rating and click "Save".
3. Refresh the page to see filtered recent actions.

To use this without unpacking the extension, copy-paste [this userscript](https://p.ip.fi/38wi) in [tampermonkey](https://www.tampermonkey.net/) or a similar tool and update rating and atLeast50 variables on line 21 according to your choice.

**UPD1** : Now you can also filter out old blogs by writing comma seperated blog ids. Updated userscript is [here](https://p.ip.fi/rRtr). Add blogIds to be filtered out on line 22.

**UPD2** : Also added filter icon in front of each blog entry which you can see on clicking "Recent Actions". To remove filter icons click again on "Recent Actions".

<details>
  <summary>spoiler</summary>
  <img src="https://codeforces.com/predownloaded/8e/47/8e47c076b46b469d1c67feef8d46120e1bb68fcb.png">
</details>