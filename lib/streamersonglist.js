/**
 * The endpoint for the API. You do not need to change this.
 */
const apiUrl = "https://api.streamersonglist.com/v1/";

/**
 * Replace this with the name you use on Twitch, using only lower case. This must also match the
 * name you have used to sign up with streamersonglist.com but this is automatic when you sign up
 * there.
 * 
 * For example, if your name on Twitch is "My_Cool_Name", you would enter "my_cool_name" here
 * (lower case).
 */
const streamerName = "fw190a8";

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
 * If set to something other than "no", will show the request limit current configured in Streamer Song List.
 * 
 * There are two possible values you could use here:
 * - "maximum" will show the total number of requests allowed for this stream, as set by your "Song Limit" in the
 *   Streamer Song List queue settings.
 * - "remaining" will show the number of requests that are remaining, which is the maximum minus the number that
 *   have already been played.
 */
const showSongLimit = 'remaining';

/**
 * If showSongLimit is "maximum", this controls the message that will appear on the screen. The # will be replaced by
 * the maximum number of requests, and plurals (request/requests) will be handled automatically.
 */
const songLimitMaximumMessage = "# request allowed today!";

/**
 * If showSongLimit is "remaining", this controls the message that will appear on the screen. The # will be replaced
 * by the remaining number of requests, and plurals (request/requests) will be handled automatically.
 */
const songLimitRemainingMessage = "# request remaining!";

/**
 * Set up classes for visual style based on allCaps above.
 */
const artistClass = allCaps ? "artist caps" : "artist";
const titleClass = allCaps ? "title caps" : "title";
const moreClass = allCaps ? "more caps" : "more";
const limitClass = allCaps ? "limit caps" : "limit";

$(function() {
    // Initialise maximum song count and played count with safe value.
    $('body').data('maximum', 0);
    $('body').data('played', 0);

    // Initialise with first API calls.
    $("body").updateQueue();

    if (showSongLimit) {
        $("body").updatePlayedCount();
        $("body").updateMaximum();
    }

    // Set intervals for further API calls.
    setInterval(function() {
        $("body").updateQueue();
    }, 10000);

    if (showSongLimit) {
        setInterval(function() {
            $("body").updateMaximum();
        }, 10000);
        setInterval(function() {
            $("body").updatePlayedCount();
        }, 10000);
    }

});

jQuery.fn.extend({

    updateQueue: function() {
        const url = apiUrl + "streamers/" + streamerName + "/queue";
        ajaxCall(url, updateQueueSuccess);
    },

    /**
     * Get the maximum number of songs allowed to be requested.
     */
    updateMaximum: function() {
        const url = apiUrl + "streamers/" + streamerName;
        ajaxCall(url, updateMaximumSuccess);
    },

    updatePlayedCount: function() {
        const url = apiUrl + "streamers/" + streamerName + "/playHistory";
        ajaxCall(url, updatePlayedCountSuccess);
    }

});

function ajaxCall(url, successCallback) {
    $.ajax({
        url: url,
        success: function(data) {
            successCallback(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("error: " + errorThrown);
        },
    });
}

function updatePlayedCountSuccess(data) {
    $('body').data('played', data.total);
}

function updateMaximumSuccess(data) {
    $('body').data('maximum', data.maxRequests);
}

function updateQueueSuccess(data) {
    let queuePosition = data.list;

    // Sort queuePosition.
    queuePosition.sort(function (a, b) {
        return a.position < b.position;
    });

    // Remove all items from current queue.
    $("#queue-wrapper").empty();

    // If the queue is empty, add a single entry to say so.
    if (queuePosition.length == 0) {
        const emptyQueueDiv = '<div><span class="' + artistClass + '">' + queueEmptyMessage + '</span></div>';
        addDivToQueueWrapper(emptyQueueDiv);
    }

    // Add the items back to the queue.
    let i = 1;
    let haveMore = true;

    queuePosition.forEach(function (item, index) {
        if (haveMore) {
            addSongToQueueWrapper(item);
            i++;

            if (i > maxQueueItems) {
                haveMore = false;
            }
        }
    });

    // Show the text for "+X more" if we need it.
    if (showMore && !haveMore) {        
        const unshown = queuePosition.length - maxQueueItems;
        const moreDiv = '<div><span class="' + moreClass + '">+' + unshown + ' more in queue</span>';
        addDivToQueueWrapper(moreDiv);
    }

    if (showSongLimit == "maximum") {     
        let message = songLimitMaximumMessage;

        // Replace placeholder with number.
        const maximum = $('body').data('maximum');
        message = message.replace("#", maximum);

        // Replace plural if we need to.
        if (maximum != 1) {
            message = message.replace("request", "requests");
        }

        const limitDiv = '<div><span class="' + limitClass + '">' + message + '</span>';
        addDivToQueueWrapper(limitDiv);
    } else if (showSongLimit == "remaining") {
        let message = songLimitRemainingMessage;

        // Replace placeholder with number.
        let remaining = $('body').data('maximum') - $('body').data('played');
        message = message.replace("#", remaining);

        // Prevent bogus values.
        if (remaining < 0) {
            remaining = 0;
        }

        // Replace plural if we need to.
        if (remaining != 1) {
            message = message.replace("request", "requests");
        }

        const limitDiv = '<div><span class="' + limitClass + '">' + message + '</span>';
        addDivToQueueWrapper(limitDiv);
    }
}

function addSongToQueueWrapper(item) {
    addDivToQueueWrapper(createSongDiv(item.song));
}

function addDivToQueueWrapper(div) {
    $('#queue-wrapper').append(div);
}

function createSongDiv(song) {
    const artist = '<span class="' + artistClass + '">' + song.artist + '</span>';
    const title = '<span class="' + titleClass + '">' + song.title + '</span>';
    const div = '<div>' + artist + title + '</div>';
    return div;
}

