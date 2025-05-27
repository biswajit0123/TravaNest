const Listing = require("../models/Listing.js")
const Review = require("../models/Review.js")
module.exports.createReview = async(req,res) =>{
let {id} = req.params;

let{review} = req.body;

const list = await Listing.findById(id)
console.log("list", list)
const newReview = await new Review(review)
newReview.author = req.user._id;
 list.reviews.push(newReview)
console.log("review")

 await newReview.save();
 await list.save();

console.log("comment saved")
    req.flash('success', 'comment created successfully')
    res.redirect(`/listings/${id}`)
}

module.exports.destroyReview =async (req, res, next) => {
    console.log("h")
    let {id, reviewId} = req.params;
    console.log(req.originalUrl)
    await Listing.findByIdAndUpdate(id, {$pull :{reviews : reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'comment deleted successfully')
    res.redirect(`/listings/${id}`)
}