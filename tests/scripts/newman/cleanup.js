require('dotenv').config()

const { Client } = require('pg')

const client = new Client()
client.connect()
client.query(
  'TRUNCATE TABLE users, authentications, threads CASCADE',
  (err, res) => {
    console.log(err ? err.stack : 'Tables truncated')
    client.end()
  }
)
