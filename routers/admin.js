const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Categoria');
const categoria = mongoose.model('categorias');
require('../models/Postagen');
const postagen = mongoose.model('postagens');
const {eAdmin} = require('../helpers/eAdmin');


router.get('/categorias',eAdmin,(req,res)=>{
    categoria.find().then((categorias)=>{
        res.render('admin/categorias',{categorias:categorias});
       
    }).catch((err)=>{
        req.flash('error_msg','Houve um erro ao tentar listár categorias');
        res.redirect('/admin/categorias');
    })
});

router.get('/categorias/add',eAdmin,(req,res)=>{
    res.render("admin/add_categorias");
})

router.post('/categorias/nova',eAdmin,(req,res)=>{

    if(!req.body.nome || !req.body.slug){    
       res.render('admin/add_categorias',{erro:'Campo nome ou slug vázio, tente novamente.'});   

    }else{

        const novaCategoria = {
             nome: req.body.nome,
             slug: req.body.slug
         }
     
         new categoria(novaCategoria).save().then(()=>{
             req.flash('success_msg','Categoria criada com susseso!!');
             res.redirect('/admin/categorias');
         }).catch((err)=>{
             req.flash('error_msg','Houve um erro ao tentar salvar categoria!!! TENTE NOVAMENTE.');
             res.redirect('/admin/categorias');
        });
    }
})

router.get('/categorias/editar/:id',eAdmin,(req,res)=>{
    categoria.findOne({_id:req.params.id}).then((categoria)=>{
        res.render('admin/editar_categorias',{categoria:categoria});
    }).catch((err)=>{
        req.flash('error_msg','Essa categoria não existe');res.redirect('/admin/categorias');
    }); 
});


router.post('/categoria/edit',eAdmin,(req,res)=>{

    if(!req.body.nome || !req.body.slug){

        req.flash('error_msg','preencha os campos obrigatório');
        res.redirect('/admin/categorias');

    }else{

        categoria.findOne({_id:req.body.id}).then((categoria)=>{
            categoria.nome = req.body.nome;
            categoria.slug = req.body.slug;
            categoria.data = req.body.data;

            categoria.save().then(()=>{
                req.flash('success_msg','Categoria editada com susseso!!')
                res.redirect('/admin/categorias')
            }).catch((err)=>{
                req.flash('error_msg','Erro ao tentar editar categoria')
                res.redirect('/admin/categorias');
            });


        }).catch((err)=>{
            req.flash('error_msg','Erro ao tentar editar categoria');
            res.redirect('/admin/categorias');
        })
    }

});

router.post('/categorias/deleta',eAdmin,(req,res)=>{
        
    categoria.deleteOne({_id:req.body.id}).then(()=>{
        req.flash('success_msg','Categoria deletada com susseso!');
        res.redirect('/admin/categorias')
    }).catch((err)=>{
        req.flash('error_msg','não foi possível deletar categoria.');
        res.redirect('/admin/categorias');
    });
});

router.get('/postagens',eAdmin,(req,res)=>{
    postagen.find().populate('categoria').sort({data:'desc'}).then((postagens)=>{
        res.render('admin/postagens',{postagens:postagens});
    }).catch((err)=>{
        req.flash('error_msg','houve um error ao tentar listá as postagens');
        res.redirect('/admin');
    })
});

router.get('/postagens/add',eAdmin,(req,res)=>{
    categoria.find().then((categorias)=>{
        res.render('admin/postagens_add',{categorias:categorias});
    }).catch((err)=>{
        req.flash('error_msg','Houve um erro ao carregar o formulário');
        res.redirect('/admin/postagens');
    });
});

router.post('/nova/postagen',eAdmin,(req,res)=>{

    if(!req.body.titulo || !req.body.slug || !req.body.descricao || !req.body.conteudo || !req.body.categoria){
        req.flash('error_msg','preencha os campos obrigatório')
        res.redirect('/admin/postagens')
    }else{

       const novaPostagen ={
            titulo:req.body.titulo,
            slug:req.body.slug,
            descricao:req.body.descricao,
            conteudo:req.body.conteudo,
            categoria:req.body.categoria
        }


        new postagen(novaPostagen).save().then(()=>{
        req.flash('success_msg','Postagen criada com sucesso');
            res.redirect('/admin/postagens');
        }).catch((err)=>{
            req.flash('error_msg','Erro ao tentar criar a postagen');
            res.redirect('/admin/postagens');

        });
    }
});

router.get('/postagen/editar/:id',eAdmin,(req,res)=>{
    postagen.findOne({_id:req.params.id}).then((postagen)=>{ categoria.find().then((categorias)=>{

        res.render('admin/editar_postagens',{postagen:postagen,categorias:categorias});

    }).catch((err)=>{
        req.flash('error_msg','Erro ao tentar editar categoria');
        res.redirect('/admin/postagens');
    });


    }).catch((err)=>{
        req.flash('error_msg','Error ao editar postagen')
        res.redirect('/admin/postagens')
    });
})

router.post('/postagen/edit',eAdmin,(req,res)=>{

    if(!req.body.titulo || !req.body.slug || !req.body.descricao || !req.body.conteudo){
        req.flash('error_msg','Campos obrigatórios vázios tente novamente!');
        res.redirect('/admin/postagens');

    }else{

        postagen.findOne({_id:req.body.id}).then((postagen)=>{

            postagen.titulo = req.body.titulo
            postagen.slug = req.body.titulo
            postagen.descricao = req.body.descricao
            postagen.conteudo = req.body.conteudo 
                      
            postagen.save().then(()=>{
                req.flash('success_msg','Postagen editada com sucesso')
                res.redirect('/admin/postagens');
            }).catch((err)=>{
                req.flash('error_msg','Erro ao tentar salvar a mensagen');
                res.redirect('/admin/postagens');
            });

        }).catch((err)=>{
            req.flash('error_msg','Erro ao tentar salvar a mensagen');
            res.redirect('/admin/postagens');
        });
    }
})

router.get('/postagen/deletar/:id',eAdmin,(req,res)=>{

    postagen.deleteOne({_id:req.params.id}).then(()=>{
        req.flash('success_msg','postagen deletada com susseso!');
        res.redirect('/admin/postagens')
    }).catch((err)=>{
        req.flash('error_msg','não foi possível deletar postagen.');
        res.redirect('/admin/postagens');
    });
})

module.exports = router;