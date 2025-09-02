const { EntitySchema } = require('@mikro-orm/core');


module.exports.RequestLog = new EntitySchema({
  name: 'RequestLog',
  properties: {
    id: { type: 'number', primary: true, autoincrement: true },
    method: { type: 'string' },
    url: { type: 'string' },
    requestBody: { type: 'json', nullable: true },
    responseBody: { type: 'json', nullable: true },
    createdAt: { type: 'date', onCreate: () => new Date() },
  },
});
