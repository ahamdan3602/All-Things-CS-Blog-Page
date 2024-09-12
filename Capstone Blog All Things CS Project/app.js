const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blogs')
//port num
const port = 3000;
//express
const app = express();
//view engine set to ejs
app.set('view engine', 'ejs');
//mongoDB


app.use(express.urlencoded({ extended: true }));

mongoose.connect(dbURI)
    .then((result)=> {
        app.listen((port));
    }).catch((err) => { 
        console.log(err)
    });


app.get('/', (req, res) => {
    // res.send('<p>');
    res.redirect('/blogs');
});

app.get('/about', (req, res) => {
    // res.send('about page');
    res.render('about', {
        title: "About"
    });
});

//blog routes
app.get('/blogs', (req, res) => {
    Blog.find().sort({createdAt: -1 })
        .then((result)=>{
            res.render('index', {title: 'All Blogs', blogs: result});
        })
        .catch((err) => {
            console.log(err)
        });
});

app.post('/blogs', (req, res) => {
    console.log('Request Body:', req.body); // Check what data is being received

    const blog = new Blog(req.body);
    blog.save()
        .then((result) => {
            res.redirect('/blogs');
        })
        .catch((err) => {
            console.log('Save Error:', err); // Log errors that occur during save
        });
});


//route paramaters - variable parts of the route that may change value
app.get('/blogs/create', (req, res) => {
    res.render('create', {
        title: "Create"
    });
});

app.get('/blogs/:id', (req, res)=> { 
    const id = req.params.id;
    Blog.findById(id)
        .then(result=> {
            res.render('details', {blog: result, title: 'Blog Details'});
        })
        .catch((err) => {
            console.log(err)
        });
});

app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;
    
    Blog.findByIdAndDelete(id)
      .then(result => {
        res.json({ redirect: '/blogs' });
      })
      .catch(err => {
        console.log(err);
      });
  });






//404 page 
app.use((req, res) => {
    res.status(404).render('404', {title: "404"});
}); 
