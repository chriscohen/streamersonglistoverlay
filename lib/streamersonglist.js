/**
 * The endpoint for the API. You do not need to change this.
 */
const apiUrl = "https://api.streamersonglist.com/api/";

/**
 * Replace this with the name you use on Twitch. This must also match the name you have used
 * to sign up with streamersonglist.com but this is automatic when you sign up there.
 */
const streamerName = "yourTwitchName";

/**
 * Your streamer ID. This is the ID assigned by streamersonglist.com and not anything
 * associated with Twitch.
 */
const streamerId = 287;

/**
 * True will cause all text to appear in capitals. False will use upper and lower case.
 */
const allCaps = true;

/**
 * The maximum number of items that can show in the queue at once. Items beyond this will either
 * not show, or use a "+X more" label at the bottom of the list, depending on the "showMore"
 * setting.
 */
const maxQueueItems = 5;

/**
 * If there are more items in the queue than maxQueueItems, and this is set to true, a "+X more"
 * will be shown at the bottom of the queue.
 */
const showMore = true;

/**
 * The message that will be displayed when there are no items in the queue.
 */
const queueEmptyMessage = "Queue is empty";

$(function() {

    $("body").updateQueue();

    setInterval(function() {
        $("body").updateQueue();
    }, 10000);

});

jQuery.fn.extend({

    updateQueue: function() {
        $.ajax({
            url: apiUrl + "streamers/" + streamerName + "/queues?inactive=false",
            success: function(data) {
                // Separate our parts of the response into queue and queuePosition.
                let queue = data.queue
                let queuePosition = data.queuePosition;

                // Sort queuePosition.
                queuePosition.sort(function(a, b) {
                    return a.position < b.position;
                });

                // Add all data from queue into queuePosition.
                queuePosition.forEach(function(item, index) {
                    queue.forEach(function(queueItem, queueIndex) {
                        if (item.queueId == queueItem.id) {
                            item.songData = queueItem;
                        }
                    });
                });

                // Remove all items from current queue.
                $("#queue-wrapper").empty();

                // Set up classes for visual style.
                let artistClass = allCaps ? "artist caps" : "artist";
                let titleClass = allCaps ? "title caps" : "title";

                // If the queue is empty, add a single entry to say so.
                if (queuePosition.length == 0) {
                    $("#queue-wrapper").append('<div><span class="' + artistClass + '">' + queueEmptyMessage + '</span></div>');
                }

                // Add the items back to the queue.
                let i = 1;
                let haveMore = true;

                queuePosition.forEach(function(item, index) {
                    if (haveMore) {
                        let artist = '<span class="' + artistClass + '">' + item.songData.songArtist + '</span>';
                        let title = '<span class="' + titleClass + '">' + item.songData.songName + '</span>';
                        let div = '<div>' + artist + title + '</div>';
                        $('#queue-wrapper').append(div);
                        i++;

                        if (i > maxQueueItems) {
                            haveMore = false;
    
                            if (showMore) {
                                let moreClass = allCaps ? "more caps" : "more";
                                let unshown = queuePosition.length - maxQueueItems;
                                let moreDiv = '<div><span class="' + moreClass + '">+' + unshown + ' more in queue</span>'
                                $('#queue-wrapper').append(moreDiv);
                            }
                        }
                    }
                });
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("error: " + errorThrown);
            }
        });
    }

});
