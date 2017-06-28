var express = require("express"),
    app = express(),
    expressSanitizer = require("express-sanitizer"),
    methodOverride = require("method-override"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");
    //App config
mongoose.connect("mongodb://localhost/restful_blog_app");    
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
 
//Mongoose/Model CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

//RESTful Routes
app.get("/", function(req, res){
   res.redirect("/blogs"); 
});
//Index Route
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
       if(err){
           console.log("Error!!");
       }  else {
           res.render("index", {blogs: blogs});
       }
    });
});
//New Route
app.get("/blogs/new", function(req, res){
   res.render("new"); 
});
//Create Route
app.post("/blogs", function(req, res){
    
//Create blog
console.log(req.body);
req.body.blog.body = req.sanitize(req.body.blog.body);
console.log("============");
console.log(req.body);

Blog.create(req.body.blog, function(err, newBlog){
    if(err){
        res.render("new");
    } else {
//then, redirect to the index
        res.redirect("/blogs");
    }
});
});
//Show Route
app.get("/blogs/:id", function(req, res){
   Blog.findById(req.params.id, function(err, foundBlog){
      if(err){
          res.redirect("/blogs");
      } else {
          res.render("show", {blog: foundBlog});
            
      }
   });
});
//Edit Route
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
       if(err){
           res.redirect("/blogs");
       } else {
           res.render("edit", {blog: foundBlog});
       }
    });
});
//Update Route
app.put("/blogs/:id", function(req, res){
   req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, UpdatedBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});
//Delete Route
app.delete("/blogs/:id", function(req, res){
    //destroy blog
    Blog.findByIdAndRemove(req.params.id, function(err){
       if(err){
        res.redirect("/blogs");   
       } else {
           res.redirect("/blogs");
       }
    });
});
const PORT = process.env.PORT || 3000;
app.use(function (req, res, next){
if(req.headers['x-forwarded-proto'] === 'https'){
  res.redirect('http://' + req.hostname + req.url);
} else {
  next();
  }
});
app.use(express.static('public'));
app.listen(PORT, function(){
  console.log('Express Server is Up on Port ' + PORT);
});


// app.listen(process.env.PORT, process.env.IP, function(){
//     console.log("Server is Running!!");
// });