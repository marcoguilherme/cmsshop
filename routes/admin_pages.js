var express = require('express');
var router = express.Router();

//Get Page model
var Page = require('../models/page');

router.get('/', (req, res)=>{
    Page.find({})
        .sort({
            sorting:1
        })
        .exec((err, pages)=>{
            res.render('admin/pages', {
                pages: pages
            })
    })
});

router.get('/add-page', (req, res)=>{
    
    var title = "";
    var slug = "";
    var content = "";

    res.render('admin/add_page',{
        title: title,
        slug: slug,
        content: content
    })
});

router.post('/add-page', (req, res)=>{
    
    req.checkBody('title', 'Titulo deve ter um valor').notEmpty();
    req.checkBody('content', 'Titulo deve ter um valor').notEmpty();

    var title = req.body.title;
    var slug = req.body.slug.replace(/\+s/g, '-').toLowerCase();
    if(slug == "") slug = title.replace(/\+s/g, '-').toLowerCase();
    var content = req.body.content;

    var errors = req.validationErrors();
    if(errors) {
        res.render('admin/add_page',{
            errors: errors,
            title: title,
            slug: slug,
            content: content
        })
    }else{
        Page.findOne({slug: slug}, (err, page)=>{
            if(page){
                req.flash('danger', 'Slug da pagina ja existente, por favor escolha outra.');

                res.render('admin/add_page',{
                    title: title,
                    slug: slug,
                    content: content
                })
            }else{
                var page = new Page({
                    title: title,
                    slug: slug,
                    content: content,
                    sorting: 100
                })

                page.save((err)=>{
                    if(err) return console.log(err);

                    req.flash('success', 'Pagina adicionada')
                    res.redirect('/admin/add-page');
                })
            }
        })
    }
});


router.post('/reorder-page', (req, res)=>{

    console.log("Ok");
   
    var ids  = req.body['id[]'];
    var count = 0;

    for(var i = 0; i < ids.length;i++ ){

        var id = ids[i];
        count++;

        ((count)=>{     
            Page.findById(id, (err, page)=>{
                page.sorting = count;
                page.save((err)=>{
                    if(err)
                        return console.log(err);

                    console.log("ok");
                })

            })
        })(count);
    }

});

//Exports
module.exports = router;