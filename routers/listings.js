const express = require('express');
const router = express.Router({mergeParams: true});
const Listing = require('../models/Listing.js');
const Review = require('../models/Review.js');
const {FormSchema} = require('../validation.js')
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const {isLogedin,isOwner,vlidateFormSchema } = require("../middleware.js")
const listingController = require('../controllers/listingController.js')
const multer  = require('multer')
const {storage} = require('../cloudconfig.js')
const upload = multer({storage })

//shoow all listing and create a new listing
router.route('/').
get(wrapAsync(listingController.index))
.post(isLogedin,upload.single('listing[image]'),vlidateFormSchema,wrapAsync(listingController.createListing))

//create a new 
router.get('/new',isLogedin, listingController.renderNewForm)

// //edit render
router.get('/:id/edit',isLogedin,isOwner,listingController.renderEditForm)

//show by id, upadte and delete route
router.route('/:id').
put(isLogedin,isOwner,upload.single('listing[image]'),vlidateFormSchema,wrapAsync(listingController.updateindDb)).
delete(isLogedin,isOwner, listingController.deleteListing).
get(wrapAsync(listingController.showByid));



module.exports = router;