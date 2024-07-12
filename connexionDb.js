
const { Client } = require('pg');

const client = new Client({
  user: 'onekdev',
  password: 'onekonga22',
  host: 'localhost',
  port: 5432, // default Postgres port
  database: 'url-shortener'
});

client.connect();