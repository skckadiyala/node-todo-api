const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {ObjectID} = require('mongodb');

const todo = [{
    _id: new ObjectID,
    text: "First Todo"
},{
    _id: new ObjectID,
    text:"Second Todo"
}]

beforeEach((done) => {
    Todo.remove({}).then(()=> {
     return Todo.insertMany(todo);
    }).then(() => done());
})

describe ('POST /todo', () => {
    it('should create a new todo', (done) => {
        var text = 'Test the Todo';

        request(app)
            .post('/todo')
            .send({text})
            .expect(200)
            .expect((res)=> {
                expect(res.body.text).toBe(text);
            })
            .end((err,res) => {
            if (err){
                return done(err);
            }

            Todo.find().then((todo)=>{
                expect(todo.length).toBe(3);
                expect(todo[2].text).toBe(text);
                done();
            }).catch((e) => done(e));
            });
    });
    it('should not create a new todo', (done) => {

        request(app)
            .post('/todo')
            .send({})
            .expect(400)
            .end((err,res) => {
                if (err){
                    return done(err);
                }

                Todo.find().then((todo)=>{
                    expect(todo.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });

    });
});

describe('GET /todo', () => {
    it('should get all the todos', (done) => {
        request(app)
            .get('/todo')
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.length).toBe(2);
            })
            .end(done);


    });
});

describe('GET /todo/id', () => {
    it('should get todo doc', (done)=>{
        request(app)
            .get(`/todo/${todo[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
            expect (res.body.todo.text).toBe(todo[0].text);
            })
            .end(done);
    });
    it('should return a 404 if todo not found', (done) => {
        var id = new ObjectID;
        request(app)
            .get(`/todo/${id.toHexString}`)
            .expect(404)
            .end(done);
    });
    it('should return a 404 for non-obejct todo id', (done) => {

        request(app)
            .get('/todo/123')
            .expect(404)
            .end(done);
    });
});