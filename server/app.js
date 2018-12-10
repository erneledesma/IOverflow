import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import { question, auth } from './routes'

const app = express()
// Utilizamos body-parser, para parsear todos los objetos de tipo Json que vengan del FrontEnd
app.use(bodyParser.json())// leemos todo lo que venga con formato JSON del cliente
app.use(bodyParser.urlencoded({ extended: true }))
// Preguntamos si estamos en un entorno de desarrollo para definir las rutas
if (process.env.NODE_ENV === 'development') {
  // Utilizamos los midware de express para acceder a los datos
  app.use((req, res, next) => {
      // Seteamos en el Header para setear los datos
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Request-With, Content-Type, Accept')
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS')
    next()
  })
}
// preguntamos si estamso en un entorno de produccion
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(process.cwd(), 'dist')))
}

app.use('/api/questions', question)
app.use('/api/auth', auth)

export default app
