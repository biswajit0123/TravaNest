const Listing = require('../models/Listing.js')
const mongoose = require('mongoose')
const {data} = require('./data.js')


async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/TravaNest');

}
main().catch((e) => {console.log("error")})


const initDb = async() => {
 
  let datas = data.map( (item) =>  ({...item,owner:"682dc7071fa8a2764fe9de28"}))
    Listing.insertMany(datas).then(res => console.log(res)).catch(err => console.log(err))
}

initDb()