var express = require('express');
var router = express.Router();

//Get Page model
var Page = require('../models/page');

router.get('/', (req, res)=>{
    res.render('index');
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
                    sorting: 0
                })

                page.save((err)=>{
                    if(err) return console.log(err);

                    req.flash('success', 'Pagina adicionada')
                    res.redirect('/admin/pages');
                })
            }
        })
    }
});

//Exports
module.exports = router;