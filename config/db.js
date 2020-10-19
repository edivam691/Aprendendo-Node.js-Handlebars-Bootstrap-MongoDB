if(process.env.NODE_ENV == 'production'){
    module.exports = {mongoURI:'mongodb+srv://edivamtavareslima:%403yL.6neLdcavtJ90%23%26@cluster0.7okig.mongodb.net/blogapp?retryWrites=true&w=majority'}
}else{
    module.exports = {mongoURI:'mongodb://localhost/blogapp'}
}