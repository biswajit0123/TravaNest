const joi = require('joi')

module.exports.FormSchema = joi.object({
    listing: joi.object({
title: joi.string().required(),
description: joi.string().required(),
location:joi.string().required(),
price: joi.number().required().min(0),
image: joi.string().allow('', null),
country: joi.string().required(),
category:joi.string().required()
 }).required()

})


module.exports.ReviewSchema = joi.object({
    review:joi.object({
        comment:joi.string().required(),
        rating:joi.number().min(1).max(5).required()
    }).required()
})