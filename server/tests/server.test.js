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
    text:"Second Todo",
    completed: true,
    completedAt: 222
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

describe('DELETE /todo/:id', () =>{
    it('should remove a todo', (done) => {
        console.log(todo[0]._id.toHexString());
        request(app)
            .delete(`/todo/${todo[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect (res.body.todo.text).toBe(todo[0].text);
            })
            .end((err, res) => {
            if(err){
                return done(err);
            }
                Todo.findById(`${todo[0]._id.toHexString()}`).then((todo)=>{
                    expect(todo).toBe(null);
                    done();
                }).catch((e) => done(e));
            });
    });
    it('should return 404 todo not found', (done) => {
        var id = new ObjectID;
        request(app)
            .delete(`/todo/${id.toHexString}`)
            .expect(404)
            .end(done);
    });
    it('should return 404 if Object Id is not valid', (done) => {
        request(app)
            .delete('/todo/123')
            .expect(404)
            .end(done);
    });
})

describe('PATCH /todo/:id', () => {
    it('should update the todo', (done)=>{
        var id = todo[0]._id.toHexString();
        var completed= true;
        var text = "Complete from test";
        request(app)
            .patch(`/todo/${id}`)
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
        var id = todo[1]._id.toHexString();

        var text = "Changed for second todo";

        request(app)
            .patch(`/todo/${id}`)
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
    })
})