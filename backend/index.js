const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MikroORM } = require('@mikro-orm/core');
const config = require('./mikro-orm.config.js');

const { User } = require('./entities/User');
const { RequestLog } = require('./entities/RequestLog');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let orm;

(async () => {
  orm = await MikroORM.init(config);
  await orm.getSchemaGenerator().updateSchema();
})();

//CRUD for Users

//create user
app.post('/create-user',async(req,res)=>{

    const em = orm.em.fork();
    const user = em.create(User, req.body);
    await em.persistAndFlush(user);
    res.json(user);
  
})

// Read all users
app.get('/users', async (req, res) => {
  const em = orm.em.fork();
  const users = await em.find(User, {});
  res.json(users);
});


// Read single user
app.get('/users/:id', async (req, res) => {
  const em = orm.em.fork();
  const user = await em.findOne(User, { id: req.params.id });
  res.json(user);
});

// Update user
app.put('/users/:id', async (req, res) => {
 
  const em = orm.em.fork();
  const user = await em.findOneOrFail(User, { id: parseInt(req.params.id) });
  user.name = req.body.name ?? user.name;
  user.email = req.body.email ?? user.email;
  await em.persistAndFlush(user);
  res.json(user);

});


// Delete user
app.delete('/users/:id', async (req, res) => {
  const em = orm.em.fork();
  const user = await em.findOneOrFail(User, { id: req.params.id });
  await em.removeAndFlush(user);
  res.json({ message: 'User deleted' });
});


 



// Save request logs
app.post('/logs', async (req, res) => {
  const em = orm.em.fork();   // <-- fork a new EntityManager for this request
  const log = em.create(RequestLog, req.body);
  await em.persistAndFlush(log);
  res.json(log);
});

// Get logs with pagination
app.get('/logs', async (req, res) => {
  const em = orm.em.fork();   // <-- fork here as well
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const [logs, count] = await em.findAndCount(RequestLog, {}, { 
    limit, 
    offset: (page - 1) * limit,
    orderBy: { createdAt: 'DESC' }
  });
  res.json({ data: logs, total: count, page });
});


app.listen(5000, () => console.log('Backend running on http://localhost:5000'));
