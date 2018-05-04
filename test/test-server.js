const chai =  require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

chai.use(chaiHttp);

describe('BlogPosts', function() {
    before(function(){
        return runServer();
    });
    after(function() {
        return closeServer();
    });

    it('should list blog posts on GET', function() {
        return chai.request(app)
        .get('/blog-posts')
        .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('array');
            expect(res.body.length).to.be.at.least(1);
            const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate'];
            res.body.forEach(function(blog) {
                expect(blog).to.be.a('object');
                expect(blog).to.include.keys(expectedKeys);
            });
        });
    });

    it('should add a blog post on POST', function() {
        const newPost = {title: 'coffee', content: 'coffee is drinkable', author: 'coffinator'};
        return chai.request(app)
          .post('/blog-posts')
          .send(newPost)
          .then(function(res) {
            expect(res).to.have.status(201);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body).to.include.keys('id', 'title', 'content', 'author', 'publishDate');
            expect(res.body.title).to.equal(newPost.title);
            expect(res.body.content).to.equal(newPost.content);
            expect(res.body.author).to.equal(newPost.author);
          });
      });
    
    it('should update blog post on PUT', function() {
        return chai.request(app)
        .get('/blog-posts')
        .then(function(res) {
            const updatePost = Object.assign(res.body[0], {title: "title", content: 'pixiedust'});
            return chai.request(app)
                .put(`/blog-posts/${res.body[0].id}`)
                .send(updatePost)
                .then(function(res) {
                    expects(res).to.have.status(204);
                });
        });
    });

    it('should delete blog on DELETE', function() {
        return chai.request(app)
            .get('/blog-posts')
            .then(function(res) {
                return chai.request(app)
                    .delete(`/blog-posts/${res.body[0].id}`)
                    .then(function(res) {
                        expect(res).to.have.status(204);
                    });    
            });
    });
})