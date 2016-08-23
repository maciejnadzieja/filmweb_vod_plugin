function Filmweb() {
    this.getMovieElements = function() {
        return $(".rankingTable > tbody > tr > td:nth-child(3)");
    };

    this.getMovieTitleFromElement = function(titleElement) {
        var titleTd = $(titleElement);
        var cap = $(".cap", titleTd).html();
        return cap ? cap : titleTd.find("a").html();
    };
}