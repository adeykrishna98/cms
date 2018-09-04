const express = require("express");

const router = express.Router();

router.get("/",(req,res)=>{
    res.render('index',{
        title:"pages"
    });
});
router.get("/test",(req,res)=>{
    res.send(' pages test');
});

module.exports = router;