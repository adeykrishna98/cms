var mongoose = require("mongoose");

var Schema = mongoose.Schema;

// Category schema 

var CategorySchema = Schema({
    title:{
        type:String,
        required:true
    },
    slug: {
        type:String
    }
});


var Category = module.exports = mongoose.model("Category",CategorySchema); 