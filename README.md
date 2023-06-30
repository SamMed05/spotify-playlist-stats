# Spotify Playlist Stats

This is a simple Chrome extension that graphs the number of songs made by each artist in a Spotify playlist using the Chart.js library.

## Features

- Displays an interactive chart using Chart.js
- Doesn't rely on the Spotify API
- Works immediately, no need for authentication

## How to use

To use the extension, simply open [Spotify](https://open.spotify.com/) and navigate to a playlist. Once inside the playlist, click on the extension and wait a few moments to let it analyze the songs. You'll see a chart displaying the collected data.

## Limitations

- The extension heavily depends on the internal HTML structure of the Spotify website, so any update to the interface could make this extension unusable.
- Since Spotify loads content dynamically and removes the tracks outside of the viewport, this extension can only analyze a maximum of ~70 songs.
- To be able to analyze as much songs as possible, the extension automatically decreases the zoom of the page temporarily to 25% (the absolute minimum in the Chrome browser).

## License

[MIT](https://choosealicense.com/licenses/mit/)
