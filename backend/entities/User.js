const { EntitySchema } = require('@mikro-orm/core');

module.exports.User = new EntitySchema({
  name: 'User',
  properties: {
    id: { type: 'number', primary: true, autoincrement: true },
    name: { type: 'string' },
    email: { type: 'string' },
    createdAt: { type: 'date', onCreate: () => new Date() },
  },
});