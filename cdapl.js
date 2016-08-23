function Cdapl() {
    this.name = "cda.pl";
    this.search = function(title) {
        return {
            "title" : title,
            "available" : true,
            "url" : "http://cda.pl/"+title,
            "searchTime" : Date.now()
        };
    }
}
