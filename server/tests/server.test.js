const expect = require('expect');
const request = require('supertest');
const jwt = require('jsonwebtoken')
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/users');
const {ObjectID} = require('mongodb');
const {todos, populateTodos, users, populateUsers} = require('./seeds/seeds');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe ('POST /todo', () => {
    it('should create a new todo', (done) => {
        var text = 'Test the Todo';

        request(app)
            .post('/todos')
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
            .post('/todos')
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
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);


    });
});

describe('GET /todo/id', () => {
    it('should get todo doc', (done)=>{
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
            expect (res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });
    it('should return a 404 if todo not found', (done) => {
        var id = new ObjectID;
        request(app)
            .get(`/todos/${id.toHexString}`)
            .expect(404)
            .end(done);
    });
    it('should return a 404 for non-obejct todo id', (done) => {

        request(app)
            .get('/todos/123')
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todo/:id', () =>{
    it('should remove a todo', (done) => {
        //console.log(todo[0]._id.toHexString());
        request(app)
            .delete(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect (res.body.todo.text).toBe(todos[0].text);
            })
            .end((err, res) => {
            if(err){
                return done(err);
            }
                Todo.findById(`${todos[0]._id.toHexString()}`).then((todos)=>{
                    expect(todos).toBe(null);
                    done();
                }).catch((e) => done(e));
            });
    });
    it('should return 404 todo not found', (done) => {
        var id = new ObjectID;
        request(app)
            .delete(`/todos/${id.toHexString}`)
            .expect(404)
            .end(done);
    });
    it('should return 404 if Object Id is not valid', (done) => {
        request(app)
            .delete('/todos/123')
            .expect(404)
            .end(done);
    });
})

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done)=>{
        var id = todos[0]._id.toHexString();
        var completed= true;
        var text = "Complete from test";
        request(app)
            .patch(`/todos/${id}`)
            .send({text, completed})
            .expect(200)
            .expect((res)=>{
                expect (res.body.todo.text).toBe(text);
                expect (res.body.todo.completed).toBe(true);
               // expect (res.body.todo.completedAt).toBeA('number');
            })
            .end(done);
    });
    it('should clear completedAt when todo is not completed ', (done)=>{
        var id = todos[1]._id.toHexString();

        var text = "Changed for second todo";

        request(app)
            .patch(`/todos/${id}`)
            .send({
                text,
                completed: false,
                completedAt: null
            })
            .expect(200)
            .expect((res)=>{
                expect (res.body.todo.text).toBe(text);
                expect (res.body.todo.completed).toBe(false);
                expect (res.body.todo.completedAt).toBe(null);
            })
            .end(done);
    });
});

describe('GET /user/me', () => {
   it('should return user if authenticated', (done)=>{
       request(app)
           .get('/users/me')
           .set('x-auth', users[0].tokens[0].token)
           .expect(200)
           .expect((res) => {
               expect (res.body._id).toBe(users[0]._id.toHexString());
               expect(res.body.email).toBe(users[0].email);
           })
           .end(done);
   });
    it('should return 401 user if not authenticated', (done)=>{
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
             expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /user', () => {
    it('should create an user', (done) => {
            var email=  'testsample@axway.com';
            var password =  'Password123';

        request(app)
            .post('/users')
            .send({email,password})
            .expect(200)
            .expect((res)=> {
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
             if(err){
                 return done(err);
             }
                User.findOne({email}).then((user) => {
               // expect(user).toExist();
                expect(user.password).toNotBe(password);
                done();
            });

            });


    });
    it('should return validation errors if request invalid', (done) => {
        var email = "ttest@tests";
        var password = "test";
        request(app)
            .post('/users')
            .send({email,password})
            .expect(400)
            .end(done);
    });

    it('should not create if email is already in use', (done) => {
        var userBody = {
            'email': 'suman@test.com',
            'password': 'Password123'
        }
        request(app)
            .post('/users')
            .send(userBody)
            .expect(400)
            .end(done);
    });
});