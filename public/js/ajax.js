$(function(){
    var page = 1;

    $("#searchInput").keyup(function() {
        var data = $("#searchInput").val();
        $.get("/campgrounds", {search: data}).done(function (r) {
            $("#row-campgrounds").html(r);
        });
    });

    $("#getMoreButton").click(function() {
       $.get("/campgrounds", {page: page}).done(function(r) {
           page++;
           console.log(r);
           $("#row-campgrounds").append(r);
        });

    });
/*
     Hiding for temporary deployment
    $("#hidebutton").load(function(){
       if($(this).attr("hide") = "true") {
           alert("yeay")
       }
    });
*/
});
