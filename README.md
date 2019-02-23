# Streamer Song List overlays

A simple overlay for displaying your current queue on streamersonglist.com.

If you are a Twitch streamer using streamersonglist.com and you would like to be able to show your song list on the screen for your viewers, you can use this overlay to do so.

## Prerequisites

* An active account at streamersonglist.com.
* Streaming software capable of showing a Browser Source, such as **OBS** or **StreamLabs OBS**.

## Initial setup

Download the ZIP file and extract it somewhere on your computer, for example, **C:\streamoverlays**.

Go inside the ```lib``` directory and open ```streamersonglist.js```. Near the top, you will see something like this:

```
const streamerName = "yourTwitchName";
```

Replace **yourTwitchName** with your Twitch name, making sure to keep the double quotes in place (the **"** characters), and save the file.

## Testing

If you would like to test if it's working properly, you can open the ```queue.html``` file in your browser. Usually you can just double-click this from Windows Explorer to open it in a browser.

You should see "queue is empty". If this is the case, you can add songs to your queue using streamersonglist.com and make sure that they appear. You will need to wait up to 10 seconds to see the changes show up.

## Streaming setup

Add a new Browser Source to your overlays. This should be at a width of 480, and a height to suit. If you are planning to have a long queue, you might want a bigger height. 480 is a good default if you're not sure.

Pick **use local file** and then find the ```queue.html``` file from your download, such as **C:\streamoverlays\queue.html**.

When you save, you should see the queue (or lack of queue) show up in the overlay immediately.
