const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Usuario');
const Usuario = mongoose.model('usuarios');
const bcrypt = require('bcryptjs');
const passport = require('passport');

router.get('/registro', (req, res) => {
    res.render('usuarios/registro');
})

router.post('/registro', (req, res) => {
    var contador = [];

    if (!req.body.nome || !req.body.email) {
        contador.push(1);
        req.flash('error_msg', 'Campos nome ou email vázios tente novamente!');
    }
    if (req.body.senha.length < 4 || req.body.senha_2.length < 4) {
        contador.push(1);
        req.flash('error_msg', 'Senha muito curta tente novamente!');
    }
    if (req.body.senha != req.body.senha_2) {
        contador.push(1);
        req.flash('error_msg', 'Senhas diferentes tente novamente!');
    }

    if (contador.length > 0) {
        res.redirect('/usuario/registro')
    } else {
        Usuario.findOne({ email: req.body.email }).then((usuario) => {
            if (usuario) {
                req.flash('error_msg', 'Já existe uma conta com este email no nosso sistema');
                res.redirect('/usuario/registro')
            } else {
                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (err, hash) => {
                        if (err) {
                            req.flash('error_msg', 'Houve um erro durante o salvamento do usuário.')
                            res.redirect('/');
                        } else {
                            novoUsuario.senha = hash;

                            novoUsuario.save().then(() => {
                                req.flash('success_msg', 'usuário salvo com sucesso!');
                                res.redirect('/');
                            }).catch((err) => {
                                console.log(err)
                                req.flash('error_msg', 'Houve um erro ao criar o usuário, tente novamente!');
                                res.redirect('/usuario/registro');
                            });
                        }
                    });
                });
            }
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro interno'); res.redirect('/')
        });
    }
});

router.get('/login', (req, res) => {
    res.render('usuarios/login');
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/usuario/login',
        failureFlash: true
    })(req, res, next);
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Deslogado com sucesso!');
    res.redirect('/');
})

module.exports = router;