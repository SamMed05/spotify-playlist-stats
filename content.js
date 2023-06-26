chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  var tab = tabs[0];
  if (!tab.url.includes("open.spotify.com")) {
    descriptionTxt.innerHTML = "Invalid URL. Go to <a href='https://open.spotify.com/'>open.spotify.com</a>";
  }
  else {
    descriptionTxt.innerText = "Loading...";
  }
});

function onWindowLoad() {
  const descriptionTxt = document.getElementById("descriptionTxt");
  const chart = document.getElementById("chart");

  setTimeout(function () {
    let message = document.querySelector("#message");

    chrome.tabs
      .query({ active: true, currentWindow: true })
      .then(function (tabs) {
        let activeTab = tabs[0];
        let activeTabId = activeTab.id;
        
        // https://stackoverflow.com/a/11696154/13122341
        return chrome.scripting.executeScript({
          target: { tabId: activeTabId },
          // injectImmediately: true, // uncomment this to make it execute straight away, other wise it will wait for document_idle
          func: DOMtoString,
          // args: ['body'] // you can use this to target what element to get the html for
        });
      })
      .then(function (results) {
        message.innerText = results[0].result;
        // Parse the HTML string
        let html = results[0].result;
        let doc = new DOMParser().parseFromString(html, "text/html");
        let presentationElements = doc.querySelectorAll('[role="row"]');

        if (presentationElements.length > 0) {
          console.log(presentationElements.length);

          let artistFrequency = {};

          for (let trackList of presentationElements) {
            let tracks = Array.from(trackList.children);

            for (let track of tracks) {
              let artistElements = track.querySelectorAll(
                'div[data-testid="tracklist-row"] div:nth-child(2) span a'
              );

              artistElements.forEach((artistElement) => {
                let artist = artistElement.innerText;

                if (artist) {
                  if (artistFrequency[artist]) {
                    artistFrequency[artist] += 1;
                  } else {
                    artistFrequency[artist] = 1;
                  }
                }
                // or
                // if (artist) {
                //   artistFrequency[artist] = artistFrequency[artist] || 0;
                //   artistFrequency[artist]++;
                // }
              });
            }
          }

          console.log(artistFrequency); // Check the extracted artist frequency

          let sortedArtists = Object.entries(artistFrequency).sort(
            (a, b) => b[1] - a[1]
          );
          let chartData = {
            labels: sortedArtists.map((entry) => entry[0]),
            datasets: [
              {
                label: "Artist Frequency",
                data: sortedArtists.map((entry) => entry[1]),
                backgroundColor: sortedArtists.map(() => getRandomColor()),
              },
            ],
          };

          createChart(chartData);

          descriptionTxt.innerText = "Most frequent artists in this playlist:";
        } else {
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var tab = tabs[0];
            if (tab.url.includes("open.spotify.com"))
              descriptionTxt.innerText = "No playlist tracks found.";
          });
        }
      })
      .catch(function (error) {
        message.innerText =
          "There was an error injecting script: \n" + error.message;
      });
  }, 2000); // Delay the execution to let the page load after the zoom out
  
  chrome.runtime.sendMessage({ action: "changeZoom", zoomFactor: 0.25 });

  setTimeout(function () {
    chrome.runtime.sendMessage({ action: "changeZoom", zoomFactor: 1 });
  }, 2000);
}

window.onload = onWindowLoad; // Invoke when browser has finished loading the DOM

function DOMtoString(selector) {
  if (selector) {
    selector = document.querySelector(selector);
    if (!selector) return "ERROR: querySelector failed to find node";
  } else {
    selector = document.documentElement;
  }
  return selector.outerHTML;
}

// https://stackoverflow.com/a/1484514/13122341
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function createChart(chartData) {
  Chart.defaults.font.size = 10;
  let ctx = document.getElementById("chart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: chartData,
    options: {
      responsive: true,
      //maintainAspectRatio: false,
      scales: {
        x: {
          ticks: {
            autoSkip: false,
            maxRotation: 90,
            minRotation: 90,
            //fontSize: 10, // doesn't work
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
}
