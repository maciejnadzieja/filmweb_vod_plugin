function toAlphanumericLowerCase(title) {
    return title.replace(/\W/g, '').toLowerCase()
}

function storeMovieCountries(movieTitle, appendCountriesCallback) {
    $.ajax({
        url: "https://flixsearch.io/search/" + encodeURIComponent(movieTitle)
    }).done(
        function (data) {
            var $jQueryObject = $($.parseHTML(data));
            $(".movie-card", $jQueryObject).first().each(
                function () {
                    var movieHref = $("a", $(this)).attr("href");
                    var movieHrefNormalized = toAlphanumericLowerCase(movieHref);
                    var flags = [];
                    if (movieHrefNormalized.includes(toAlphanumericLowerCase(movieTitle))) {
                        flags = $("img.flag-post", $(this));
                    }
                    var countries = $.map(flags, function (flag) {
                        return $(flag, 'img').attr('title');
                    });

                    var obj = {};
                    obj[toAlphanumericLowerCase(movieTitle)] = countries;
                    chrome.storage.local.set(obj);
                    appendCountriesCallback(countries);
                });
        }
    );
}

function processRankingMovies() {
    $(".rankingTable > tbody > tr > td:nth-child(3)").each(
        function () {
            var titleTd = $(this);
            var cap = $(".cap", titleTd).html();
            var movieTitle;
            if (cap) {
                movieTitle = cap;
            } else {
                movieTitle = titleTd.find("a").html();
            }

            chrome.storage.local.get(toAlphanumericLowerCase(movieTitle), function (result) {
                if (!result[toAlphanumericLowerCase(movieTitle)]) {
                    storeMovieCountries(movieTitle, function (countries) {
                        titleTd.append(countries.join(" "));
                    });
                } else {
                    titleTd.append(result[toAlphanumericLowerCase(movieTitle)].join(" "));
                }
            });
        }
    );
}

function updateLastSync (processRankingMoviesCallback) {
    var lastSyncStorageKey = "____last_sync_____";
    chrome.storage.local.get(lastSyncStorageKey, function (result) {
        if (!result[lastSyncStorageKey]) {
            var obj = {};
            obj[lastSyncStorageKey] = Date.now();
            chrome.storage.local.set(obj);
            processRankingMoviesCallback();
        } else {
            var lastSync = new Date(result[lastSyncStorageKey]);
            var syncDelayInMs = 24 * 60 * 60 * 1000;
            if (Date.now() - lastSync.getTime() > syncDelayInMs) {
                chrome.storage.local.clear(function () {
                    processRankingMoviesCallback();
                });
            } else {
                processRankingMoviesCallback()
            }
        }
    });
}

updateLastSync(processRankingMovies);
