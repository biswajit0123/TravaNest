const Listing = require('../models/Listing.js');
const ExpressError = require('../utils/ExpressError.js')
const {FormSchema} = require('../validation.js')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken= process.env.MAP_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) =>{
    console.log(req.query.sort)
    if(!req.query.sort){
           let listings =await Listing.find({});
           res.render('Listing/listing.ejs', {listings}) 
    }else{
        let category = req.query.sort;
        let listings =await Listing.find({category:category});
        res.render('Listing/listing.ejs', {listings}) 
    }
   
}

module.exports.renderNewForm = (req, res)=>{
    res.render('Listing/new.ejs')
}

module.exports.createListing = async (req, res,next)=>{
//     console.log(req.body.listing)
//      if( !req.body.listing ){
//     throw new ExpressError(400, "no lising object")
//  }

// const result = FormSchema.validate(req.body)
// console.log(result)
// if(result.error){
//     throw new ExpressError(400, result.error.details[0].message)
// }
console.log(req.body)
let response =await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
}).send()





let url = req.file.path;
let filename = req.file.filename;
console.log(url)
 let {listing} = req.body
       let newListing =  await new Listing(listing)
   newListing.owner = req.user._id;
   newListing.image = {url, filename}

   newListing.geometry = response.body.features[0].geometry
       let created = await newListing.save()
        console.log(created)
       req.flash('success', 'Listing created successfully')
      
res.redirect('/listings')
}

module.exports.renderEditForm = async (req, res) =>{
    let {id} = req.params;
    try {
      const list =  await Listing.findById(id)
      console.log(list)
      let previewUrl = list.image.url;
      previewUrl = previewUrl.replace("/upload", "/upload/w_400")
        res.render("Listing/edit.ejs",{list, previewUrl})
    } catch (error) {
        console.log(error)
        res.send("Error fetching listings")
    }
   
}

module.exports.updateindDb = async (req, res) =>{
let {id} = req.params;
let {listing} = req.body;
let list= await Listing.findById(id)
console.log(list)


    const updatedist =await Listing.findByIdAndUpdate(id,listing, {new:true})
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename= req.file.filename;
    updatedist.image = {url, filename};
    await updatedist.save();
    console.log(updatedist)
    }
 
    req.flash('success', 'Listing updated successfully')
    res.redirect(`/listings/${id}`)
    
}

module.exports.deleteListing = (req, res) =>{
let {id} = req.params;
Listing.findByIdAndDelete(id).then( () =>{
    req.flash('success', 'Listing deleted successfully')
     console.log("deleted")
  res.redirect('/listings')
}
   
).catch(err => {res.send("Error deleting listing")})
}


module.exports.showByid =async (req, res) =>{
let {id} = req.params;

       let list =await Listing.findById(id).
       populate({path:"reviews", populate:{
        path:"author"
       }}).
       populate('owner');

       console.log(list)
       if(!list){
       req.flash('error', 'Listing not found')
      return  res.redirect('/listings')
       }
       res.render('Listing/show.ejs', {list}) 

}