function toAlphanumericLowerCase(title) {
    return title.replace(/\W/g, '').toLowerCase()
}

function storeMovieInfo(storageKey, movieSearchResult) {
    var obj = {};
    obj[storageKey] = movieSearchResult;
    chrome.storage.local.set(obj);
}
function isOutdated(time, delayInMs) {
    return Date.now() - time > delayInMs;
}

function getMovieLink(providerName, url, title) {
    return "<a href=\""+url+"\">"+providerName+":"+title+"</a><br/>";
}

var filmweb = new Filmweb();
var vodProviders = [new Netflix(), new Cdapl()];
var syncDelayInMs = 10000;//24 * 60 * 60 * 1000;

filmweb.getMovieElements().each(function(index, titleElement) {
    var movieTitle = filmweb.getMovieTitleFromElement(titleElement);
    vodProviders.forEach(function (vodProvider) {
        var storageKey = toAlphanumericLowerCase(vodProvider.name + movieTitle);
        chrome.storage.local.get(storageKey, function (result) {
            var movieSearchResult;
            if (!result[storageKey] || isOutdated(result[storageKey].searchTime, syncDelayInMs)) {
                movieSearchResult = vodProvider.search(movieTitle);
                storeMovieInfo(storageKey, movieSearchResult);
            } else {
                movieSearchResult = result[storageKey];
            }
            $(titleElement).append(getMovieLink(vodProvider.name, movieSearchResult.url, movieSearchResult.title));
        });
    });
});