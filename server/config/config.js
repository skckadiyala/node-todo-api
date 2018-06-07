var env = process.env.NODE_ENV || 'dev';

if(env === 'dev'){
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://mongo-service:27017/TodoApp';
} else (env === 'test')
{
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://mongo-service:27017/TodoAppTest';
}