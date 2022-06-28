const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId


const blogSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    body: {
        required: true,
        type: String
    },
    authorId: {
        required: true,
        type: ObjectId,
        ref: 'Author'
    },


    tags: [ String ],

    category:

    {
        type: String,
        required: true
    },

    subcategory: [String],

    isDeleted: {
        default: false,
        type: Boolean
    },
    isPublished: {
        default: false,
        type: Boolean
    },
    publishedAt: {
        type: Date, default: null
    },
    deletedAt: {
        type: Date, default: null
    }
},{ timestamps: true });


module.exports = mongoose.model('Blog', blogSchema)        //blogs 











/* , category: {string, mandatory, examples: [technology, entertainment, life style, food, fashion]}, subcategory: {array of string, examples[technology-[web development, mobile development, AI, ML etc]] }, createdAt, updatedAt, deletedAt: {when the document is deleted}, isDeleted: {boolean, default: false}, publishedAt: {when the blog is published}, isPublished: {boolean, default: false}} */