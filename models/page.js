var mongoose = require("mongoose");

var Schema = mongoose.Schema;

// page schema 


var pageSchema = Schema({
    title:{
        type:String,
        required:true
    },
    slug: {
        type:String
    },
    content:{
        type:String,
        required:true
    },
    sorting:{
        type:Number
       
    }
    
});


var Page = module.exports = mongoose.model("Page",pageSchema); 