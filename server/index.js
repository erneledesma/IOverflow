import http from 'http'
import Debug from 'debug'
import app from './app'
import mongoose from 'mongoose'
import { mongoUrl, port } from './config'

const debug = new Debug('ideas-overflow:root')
// pasamos a monggose el sistema de promesa
mongoose.Promise = global.Promise

// definimos la funcion async de mongo
async function start() {
  await mongoose.connect(mongoUrl, { useMongoClient: true })

// establecemos la conexion de mongo
  app.listen(port, () => {
    // console.log(`Server running at port ${PORT}`);
    debug(`Server running at port ${port}`)
  })
}

start()
