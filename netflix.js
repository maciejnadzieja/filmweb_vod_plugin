function Netflix() {
    this.name = "netflix";
    this.search = function(title) {
        return {
            "title" : title,
            "available" : true,
            "url" : "http://netflix.com/"+title,
            "searchTime" : Date.now()
        };
    }
}
