const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todo = [{
    text: "First Todo"
},{
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