/**
 * The endpoint for the API. You do not need to change this.
 */
const apiUrl = "https://api.streamersonglist.com/api/";

/**
 * Replace this with the name you use on Twitch, using only lower case. This must also match the
 * name you have used to sign up with streamersonglist.com but this is automatic when you sign up
 * there.
 * 
 * For example, if your name on Twitch is "My_Cool_Name", you would enter "my_cool_name" here
 * (lower case).
 */
const streamerName = "your_twitch_name";

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

/**
 * If set to true, will show the request limit current configured in Streamer Song List. Note that the API
 * currently doesn't support showing the number of songs remaining; only the total number allowed.
 */
const showSongLimit = false;

/**
 * If showSongLimit is true, this controls the message that will appear on the screen. The # will be replaced by
 * the maximum number of requests, and plurals (request/requests) will be handled automatically.
 */
const songLimitMessage = "# request allowed today!";

$(function() {
    // Initialise remaining song count with safe value.
    $('body').data('remaining', 0);

    // Initialise with first API calls.
    $("body").updateQueue();

    if (showSongLimit) {
        $("body").updateRemaining();
    }

    // Set intervals for further API calls.
    setInterval(function() {
        $("body").updateQueue();
    }, 10000);

    if (showSongLimit) {
        setInterval(function() {
            $("body").updateRemaining();
        }, 10000);
    }

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
                        }
                    }
                });

                // Show the text for "+X more" if we need it.
                if (showMore && !haveMore) {
                    let moreClass = allCaps ? "more caps" : "more";
                    let unshown = queuePosition.length - maxQueueItems;
                    let moreDiv = '<div><span class="' + moreClass + '">+' + unshown + ' more in queue</span>'
                    $('#queue-wrapper').append(moreDiv);
                }

                if (showSongLimit) {
                    let limitClass = allCaps ? "limit caps" : "limit";
                    let message = songLimitMessage;

                    // Replace placeholder with number.
                    let remaining = $('body').data('remaining');
                    message = message.replace("#", remaining);

                    // Replace plural if we need to.
                    if (remaining != 1) {
                        message = message.replace("request", "requests");
                    }

                    let limitDiv = '<div><span class="' + limitClass + '">' + message + '</span>';
                    $('#queue-wrapper').append(limitDiv);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("error: " + errorThrown);
            }
        });
    },

    updateRemaining: function() {
        $.ajax({
            url: apiUrl + "streamers/" + streamerName,
            success: function(data) {
                $('body').data('remaining', data.maxRequests);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("error: " + errorThrown);
            }
        })
    }

});
