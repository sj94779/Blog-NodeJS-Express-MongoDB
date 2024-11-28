const express = require('express');
const router = express.Router();
const Post = require('../models/Post');


/**
 * GET /
 * Home
*/

//Routes
router.get('', async (req, res) => {


  try {
    const locals = {
      title: "NodeJS Blog",
      description: "Simple Blog created with NodeJS, Express & MongoDB."
    }


    let perPage = 5;
    let page = req.query.page || 1;

    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();


    const count = await Post.countDocuments({});
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render('index', {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: '/'

    });

  } catch (error) {
    console.log(error);
  }



});

/**
 * GET /
 * Post :id
*/
router.get('/post/:id', async (req, res) => {
  

  try {

     let slug = req.params.id;

     const data = await Post.findById({_id: slug});

    const locals = {
      title: data.title,
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
      currentRoute: `/post/${slug}`
    }

    res.render('post', { locals, data });
  } catch (error) {
    console.log(error);
  }

});

/**
 * Post /
 * Post - searchTerm
*/
router.post('/search', async (req, res) => {
 

  try {
    const locals = {
      title: "Search",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

let searchTerm = req.body.searchTerm;
const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

const data = await Post.find({
  $or: [
    {title: { $regex: new RegExp(searchNoSpecialChar, 'i')}},
    {body: { $regex: new RegExp(searchNoSpecialChar, 'i')}}
  ]
});

  res.render("search_result",{
data,
locals
  });

  } catch (error) {
    console.log(error);
  }

});


/**
 * GET /
 * Post :id
*/
// router.get('', async (req, res) => {
//   const locals = {
//     title: "NodeJs Blog",
//     description: "Simple Blog created with NodeJs, Express & MongoDb."
//   }

//   try {
//     const data = await Post.find();
//     res.render('index', { locals, data });
//   } catch (error) {
//     console.log(error);
//   }

// });




// function insertPostData(){
//   Post.insertMany([
//     {
//       title:"post1",
//       body:"Post1 body"
//     },
//     {
//       title:"post2",
//       body:"Post2 body"
//     },
//     {
//       title:"post3",
//       body:"Post3 body"
//     },
//     {
//       title:"post4",
//       body:"Post4 body"
//     },
//     {
//       title:"post5",
//       body:"Post5 body"
//     },
//     {
//       title:"post6",
//       body:"Post6 body"
//     },
//   ])
// }

// insertPostData();


router.get('/about', (req, res) => {
  res.render('about', {
    currentRoute: '/about'
  });
});


router.get('/contact', (req, res) => {
  res.render('contact', {
    currentRoute: '/contact'
  });
});

module.exports = router;
