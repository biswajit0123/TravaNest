const mongoose = require('mongoose');
const Review = require('./Review.js');
const { required } = require('joi');

const listingSchema = new mongoose.Schema({
    title:{
        type: String,
        required:true
    },
    description:String,
    image:{
    url:String,
    filename:String
    },
    price:Number,
    location:String, 
    country:String,
    reviews:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
          type: mongoose.Schema.Types.ObjectId,
          ref:"User"
    },
    geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  category:{
    type:String,
    enum:['house', 'cave', 'cottage', 'mountain', 'boating', 'castle','farm','arctic','treehouse','forest','island','beach','camping'],
    required:true
  }

})

listingSchema.post('findOneAndDelete', async(list)=>{
if(list){
    await Review.deleteMany({_id: {$in : list.reviews}})
}
})
const Listing= mongoose.model('Listing', listingSchema);
module.exports = Listing;