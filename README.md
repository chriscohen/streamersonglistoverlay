# Streamer Song List overlays

A simple overlay for displaying your current queue on streamersonglist.com.

If you are a Twitch streamer using streamersonglist.com and you would like to be able to show your song list on the screen for your viewers, you can use this overlay to do so.

## Prerequisites

* An active account at streamersonglist.com.
* Streaming software capable of showing a Browser Source, such as **OBS** or **StreamLabs OBS**.

## Setup

Download the ZIP file and extract it somewhere on your computer, for example, **C:\streamoverlays**.

Go inside the ```lib``` directory and open ```streamersonglist.js```. Near the top, you will see something like this:

```
const streamerName = "yourTwitchName";
```

Replace **yourTwitchName** with your Twitch name, making sure to keep the double quotes in place (the **"** characters), and save the file.

## Testing

If you would like to test if it's working properly, you can open the ```queue.html``` file in your browser. Usually you can just double-click this from Windows Explorer to open it in a browser.