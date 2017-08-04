$(function(){
   /*
   Used for keeping track of how many "pages" of content has been loaded with AJAX
   Used in .skip() function at backend when using the "load more" button
   */
    var page = 1;

    //Hides the "Load more" button if #buttonHide span is rendered on the page
    function loadMoreButton() {
        if($("#buttonHide").data("hide") === true) {
            $("#getMoreButton").hide();
        } else {
            $("#getMoreButton").show();
        }
    }

    //Send an GET request every time data is modified in #searchInput
    $("#searchInput").keyup(function() {
        var data = $("#searchInput").val();
        $.get("/campgrounds", {search: data}).done(function (r) {
            $("#row-campgrounds-info").html(r);
            loadMoreButton();
        });
        //resets the page number so the next time the "Load more" button is pressed, it wont .skip() too much content
        page = 1;
    });

    //Sends a get request to load more data, skipping the already shown campgrounds using the page variable
    $("#getMoreButton").click(function() {
        var data = $("#searchInput").val();
       $.get("/campgrounds", {page: page, search: data}).done(function(r) {
           page++;
           $("#row-campgrounds").append(r);
            loadMoreButton();
        });
    });
});
