const Listing = require("../models/listing");
// const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// const mapToken = process.env.MAP_TOKEN;
// const geoCodingClient =  mbxGeocoding({accessToken: mapToken});

module.exports.index = 
async (req, res) => {
    const allListings = await Listing.find({});
    console.log(allListings);   // <-- Add this line
    res.render("listings/index", { allListings });
};

module.exports.renderNewForm = (req, res)=>{
   
    res.render("listings/new");
};

module.exports.showListing = async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {
        path: "author",
    },}).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show", {listing});
};

module.exports.createListing = async (req, res, next) => {

    const newListing = new Listing(req.body.listing);

    newListing.owner = req.user._id;

    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;
        newListing.image = { url, filename };
    }

    newListing.geometry = {
        type: "Point",
        coordinates: [77.5946, 12.9716],
    };

    let savedListing = await newListing.save();

    req.flash("success", "New Listing created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){req.flash("error", "The listing you requested for does not exist!");
       return res.redirect("/listings");
    }

   let originalImage =  listing.image.url;
   originalImage = originalImage.replace(
    "/upload",
    "/upload/w_250"
);
    res.render("listings/edit.ejs", {listing, originalImage});
};

module.exports.updateListing = async (req, res) => {

    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !="undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
    
};

module.exports.destroyListing = async (req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};