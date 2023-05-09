// XXIV.05. We also have to require JOI here:
// const Joi = require('joi');
// XCVI.02. We're going to rename this to BaseJoi:
// AFTER: We're going to add extend below to BaseJoi (XCVI.03)
const BaseJoi = require('joi');

//                  XCVI. SANITIZING HTML W/JOI

// XCVI. NOTE: Read more about it in Setup.txt 13.03.

// XCVI.06. Requiring sanitize-html:
const sanitizeHtml = require('sanitize-html'); 

// XCVI.01. First we add this code from DOCS:
// AFTER: In order to use this extension, we have to add it to JOI
const extension = (joi) => ({
	type: 'string',
	base: joi.string(),
	messages: {
		'string.escapeHTML': '{{#label}} must not include HTML!'
	},
	rules: {
		escapeHTML: {
			validate(value, helpers) {
				const clean = sanitizeHtml(value, {
                    // NOTE: This line here, we're saying that we're not allowing any Tags, or Attributes.
					allowedTags: [],
					allowedAttributes: {},
				}); // NOTE: Then here, we're checking if there's a difference between the input, and the sanitized output, and if there was, we'll just return that error, and sends back the "messages" above
				if (clean !== value) return helpers.error('string.escapeHTML', { value })
				return clean;
			}
		}
	}
});

// XCVI.04. Adding extension to BaseJoi, and saving it Joi: (NOTE: That's just the way it is)
// NOTE: We do this, because then we don't have to deal with other changes. => Now we have the option to use this in JOI
// AFTER: We're going to add "escapeHTML" to the title, location (shortly anywhere where we use text) below (XCVI.05.)
const Joi = BaseJoi.extend(extension);

// XXIV.04. We paste in the campgroundSchema: (NOTE: We can just export it right away)
// NOTE: Later on we can add on some new ones, if we have a user, review etc.
// AFTER: We have to require this in our app.js (XXIV.06.)
module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        // XCVI.05. Adding escapeHTML extenstion everywhere where we use text:
        // AFTER: Don't forget to require sanitize-html at the top (XCVI.06.)
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        // image: Joi.string().required(),
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML()
    }).required(),
    // LXXIV.05. Adding Joi validation for deleting images: (NOTE: Test it!) (AFTER: )
    deleteImages: Joi.array()
});
// XXVIII.02. We do the JOI validation in server-side for reviewSchema: (NOTE: Pretty much the same idea as above!)
// AFTER: Now we can require our reviewSchema in app.js (XXVIII.03.) (NOTE: Adding it together with { campgroundSchemam })
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().escapeHTML() 
    }).required() 
})


