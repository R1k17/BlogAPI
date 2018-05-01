const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

/* Note that to create a new blog post, 
you need to supply a title, content, an author name, 
and (optionally) a publication date. */
BlogPosts.create(
    {
        title: 'Glas',
        content: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam',
        author: 'Henry Pierce',
    }
);

BlogPosts.create(
    {
        title: 'Wood',
        content: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam',
        author: 'David Parker',
    }
);

BlogPosts.create(
    {
        title: 'Stone',
        content: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam',
        author: 'Lauren Mitchell',
    }
);

// it is not /blog-posts !!!! But why ?
// router.get('/blog-posts', (req, res) => {
router.get('/', (req, res) => {
    res.json(BlogPosts.get());
})

router.post('/', jsonParser, (req, res) => {
    //insert blog post code here
    // required fields are title, author, content
    const requiredFields = ['title', 'content', 'author'];
    for(let i=0; i<requiredFields.length; i++){
        const field = requiredFields[i];
        if(!(field in req.body)){
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }
    const item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
    res.status(201).json(item);
});

//Delete blogs by id
router.delete('/:id', (req, res) => {
    BlogPosts.delete(req.params.id);
    console.log(`Deleted blog post ${req.params.title}, ${req.params.id}`);
    res.status(204).end();
})

router.put('/:id', jsonParser, (req, res) => {
    const requiredFields = ['id', 'title', 'content', 'author'];
    for (let i=0; i<requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`
        console.error(message);
        return res.status(400).send(message);
      }
    }
    if (req.params.id !== req.body.id) {
      const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
      console.error(message);
      return res.status(400).send(message);
    }
    console.log(`Updating blog posts \`${req.params.id}\``);
    BlogPosts.update({
      id: req.params.id,
      title: req.body.title,
      content: req.body.content,
      author: req.body.author
    });
    res.status(204).end();
  });

module.exports = router;