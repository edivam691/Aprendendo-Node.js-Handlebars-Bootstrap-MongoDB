//Carregando Modulos
const express = require('express');
const handlebars = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const Handlebarss = require('handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const admin = require('./routers/admin');
const usuario = require('./routers/usuario');
const session = require('express-session');
const flash = require('connect-flash');
require('./models/Postagen');
const postagen = mongoose.model('postagens');
require('./models/Categoria');
const categoria = mongoose.model('categorias');
const passport = require('passport');
require('./config/auth')(passport);
const db = require('./config/db');
const app = express();

//Configurações:
//session
app.use(session({
    secret: 'cursodenode',
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
//middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})
//bordy-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
//handlebars
app.engine('handlebars', handlebars({ handlebars: allowInsecurePrototypeAccess(Handlebarss) }));
app.set('view engine', 'handlebars')
//Mongoose
mongoose.promise = global.promise
mongoose.connect(db.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Conectado com susseso!");
}).catch((err) => {
    console.log("Não foi possivel connectar!  " + err);
});
//public
app.use(express.static(path.join(__dirname, 'public')));
//rotas
app.get('/', (req, res) => {
    postagen.find().populate('categoria').sort({ data: 'desc' }).then((postagens) => {
        res.render("admin/index", { postagens: postagens });
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro interno')
        res.redirect('/404');
    });
})

app.get('/postagens/:slug', (req, res) => {
    postagen.findOne({ slug: req.params.slug }).then((postagens) => {
        if (postagens) {
            res.render('postagens/index', { postagens: postagens });
        } else {
            req.flash('error_msg', 'Esta postagen não existe!')
            res.redirect('/');
        }
    }).catch((err) => {
        req.flash('error_msg', 'houve um erro interno');
        res.redirect('/');
    })
})

app.get('/categorias', (req, res) => {
    categoria.find().then((categorias) => {
        res.render('categorias/index', { categorias: categorias });
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro interno ao lista as categorias')
        res.redirect('/');
    });
})

app.get('/categoria/:slug', (req, res) => {
    categoria.findOne({ slug: req.params.slug }).then((categoria) => {
        if (categoria) {
            postagen.find({ categoria: categoria._id }).then((postagen) => {
                res.render('categorias/postagens', { categoria: categoria, postagens: postagen });
            }).catch((err) => {
                req.flash('error_msg', 'Houve um erro ao listar os posts')
                res.redirect('/');;
            })
        } else {

        }
    }).catch((err) => {
        req.flash('error_msg', 'esta categoria não existe!');
        res.redirect('/');
        console.log(err)
    });
})

app.get('/404', (req, res) => {
    res.send('<h3>error 404!<h3>')
})


app.use('/admin', admin);

app.use('/usuario', usuario)

//outros
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("servidor de pé!")
});