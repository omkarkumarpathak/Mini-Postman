const { SqliteDriver } = require('@mikro-orm/sqlite');
const {User}=require('./entities/User')
const {RequestLog}=require('./entities/RequestLog')

module.exports = {
  entities: [User,RequestLog],
  dbName: 'requests.sqlite3',
  driver: SqliteDriver,  
};
