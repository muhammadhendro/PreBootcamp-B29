const express = require('express');
const app = express()
const port = 5000

let isLogin = true

app.set('view engine', 'hbs')

app.use('/public', express.static(__dirname+'/public'))
app.use(express.urlencoded({extended: false}))

app.get('/', (req, res) => {
    res.render('index', {title: 'Home'})
})

app.get('/add-blog', (req, res) => {
    res.render('add-blog',  {title: 'Add New Blog'})
})
app.get('/blog', (req, res) => {
    res.render('blog', {isLogin, title: 'Creating Blog Page'})
})

app.get('/contact', (req, res) => {
    res.render('contact', {title: 'Contact Me'})
})

app.get('/detail-blog/:id', function(req,res){

    let id = req.params.id

    res.render('blog-detail', { id ,title: 'Blog Page Detail'}) 
})

app.post('/blog', function(req,res){
    console.log(req.body)
})

app.use('/', (req, res) => {
    res.status(404);
    res.send('<h1>ERROR 404</h1>');
})

app.listen(port, () => {
    console.log(`Server starting on port: ${port}`)
})