const express = require("express");
const Page = require('../models/page');
const router = express.Router();


/*
    Get admin/pages:
*/ 
router.get("/", (req, res) => {
    Page.find({}).sort({ sorting: 1 }).exec((err, data) => {

        res.render("admin/pages", {
            pages: data
        })
    })
});

/*
    Get page for add:
*/
router.get('/addPage', (req, res) => {

    var title = '';
    var slug = '';

    var content = '';

    res.render("admin/addPage", {
        title: title,
        slug: slug,
        content: content
    });
});

/*
    Post add page:
*/
router.post('/addPage', (req, res) => {
    req.checkBody("title", 'Title  required').notEmpty();
    req.checkBody("content", 'content required').notEmpty();
    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if (slug == "") slug = title.replace(/\s+/g, '-').toLowerCase();
    var content = req.body.content;
    var errors = req.validationErrors();
    console.log(slug);
    if (errors) {

        res.render("admin/addPage", {
            errors: errors,
            title: title,
            slug: slug,
            content: content
        });
    } else {
        Page.findOne({ slug: slug }, function (err, page) {
            if (page) {
                req.flash('danger', "page slug exist choose another  ");
                res.render('admin/addPage', {
                    title: title,
                    slug: slug,
                    content: content
                });
            }else {
                var page = new Page({
                    title: title,
                    slug: slug,
                    content: content,
                    sorting: 100
                });
                console.log(page)
                page.save((err, page) => {
                    if (err) {
                        return console.log(err);
                    }
                    req.flash("succes", "page added");
                    res.redirect("/admin/pages");
                })
            }
        });
    }

});

/*
    Reordering pages:
*/
router.post("/reorderPage", (req, res) => {
    var ids = req.body['id[]'];
    console.log(ids);
    var count = 0;
    for (var i = 0; i < ids.length; i++) {
        var id = ids[i];
        count++

        (function (count) {
            Page.findById(id, function (err, page) {
                page.sorting = count;
                page.save(function (err) {
                    if (err) {
                        return console.log(err);
                    }
                });
            })
        })(count);
    }
});

/*
    Get edit page for pages edit:
*/
router.get("/edit-page/:slug", (req, res) => {
    Page.findOne({ slug: req.params.slug }, function (err, page) {
        if (err) {
            return err;
        }
        res.render('admin/editPage', {
            title: page.title,
            slug: page.slug,
            content: page.content,
            id: page._id
        });
    });
});

/*
    Post edit page for pages edit:
*/
router.post("/edit-page/:slug", (req, res) => {
    req.checkBody("title", 'Title  required').notEmpty();
    req.checkBody("content", 'content required').notEmpty();
    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if (slug == "") slug = title.replace(/\s+/g, '-').toLowerCase();
    var content = req.body.content;
    var id = req.body.id;
    var errors = req.validationErrors();
    if (errors) {
        res.render('admin/editPage', {
            errors: errors,
            title: title,
            slug: slug,
            content: content,
            id: id
        });
    }
    else{
        Page.findOne({ slug: slug, _id:{'$ne':id }}, function (err, page) {
            if (page) {
                req.flash('danger', "page slug exist choose another");
                res.render('admin/editPage', {
                    title: title,
                    slug: slug,
                    content: content,
                    id:id
                });
            }
            else {
                Page.findById(id,function(err,page){
                    if(err){
                        return console.log("err");
                    }
                    page.title = title;
                    page.slug = slug;
                    page.content = content;
                    page.save(function(err){
                        req.flash("success","updated ");
                        res.redirect('/admin/pages/edit-page/'+ page.slug);
                    }); 

                })
            }
        });
    }
});

/*
    Get Delete route
*/
router.get("/delete-page/:id", (req, res) => {
    Page.findByIdAndRemove(req.params.id,function(err,page){
        if(err){
            return console.log(err);
        }
        req.flash("success","deleted");
        res.redirect('/admin/pages')
    });
});

// Exports admin pages module:
module.exports = router;