var mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment");

var data = [
        {
            name: "Käskyvuori",
            img: "http://static.panoramio.com/photos/large/91131699.jpg",
            desc: "Käskyvuori, tuo mahtipontisen nimen omaava paikka sijaitsee Kihniön pohjoisrajalla. Käskyvuori rajaa Pohjois-Pirkanmaan ja Etelä-Pohjanmaan, ollen näin maisemaa hallitseva maamerkki."
        },
        {
            name: "Mount Coffee",
            img: "https://cdn2.bigcommerce.com/server3300/bf3bb/product_images/uploaded_images/wilson-460108-mobile-4g-cell-phone-signal-booster-on-the-road.jpg",
            desc: "Pitchfork kale chips freegan, helvetica deep v asymmetrical intelligentsia waistcoat hot chicken activated charcoal YOLO semiotics mustache heirloom wolf. Bitters leggings typewriter vexillologist umami, squid tote bag crucifix gluten-free tofu glossier bushwick deep v snackwave beard. Freegan hammock post-ironic tumeric, gochujang mlkshk jean shorts."
        },
        {
            name: "Latte Light Peak",
            img: "https://s-media-cache-ak0.pinimg.com/736x/3e/02/03/3e0203c7649cca9e619168b5f1d785b5.jpg",
            desc: " Disrupt sartorial locavore ethical food truck taxidermy, venmo intelligentsia deep v everyday carry chia cray marfa. Selvage try-hard fingerstache pug tbh pabst 90's, shabby chic beard. Seitan 8-bit fam, lyft PBR&B selfies locavore. Bitters yuccie craft beer, fam chillwave meh la croix raw denim retro tofu."
        },
        {
            name: "Mount Mustache",
            img: "https://s-media-cache-ak0.pinimg.com/originals/25/2b/69/252b6995d403708252b127f505f71a0e.jpg",
            desc: "8-bit pickled seitan small batch art party snackwave godard vegan raclette. Tbh la croix air plant wolf poutine street art selfies health goth, irony man bun. Celiac aesthetic affogato XOXO. Bitters vinyl ethical iPhone bushwick crucifix gluten-free irony etsy tumeric williamsburg franzen mumblecore cardigan. Mustache cliche wayfarers tbh pop-up."
        }
        
    ];

function seedDB() {
    Campground.remove({}, function (err) {
        if(err) {
            console.log(err);
        } else {
            console.log("Campgrounds removed!");
              //ADD  campgrounds
             data.forEach(function(seed) {
                Campground.create(seed, function(err, campground) {
                    if (err) {
                        console.log(err);    
                    } else {
                        console.log("Added a campground");
                        //create a comment
                        Comment.create(
                            {
                                text: "This place is great, but I wish it had more foxes and deers",
                                author: "Japanese turist"
                            }, function(err, comment) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    //console.log(comment);
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("Created a comment");
                                }
                            });
                     }
                });
            });
        }
    });
}

module.exports = seedDB;