import express from 'express'
import Debug from 'debug'
import jwt from 'jsonwebtoken'
import { secret } from '../config'
import { User } from '../models'
import {
  hashSync as hash,
  compareSync as comparePasswords
} from 'bcryptjs'
//Definimos mas rutas
const app = express.Router()
const debug = new Debug('i-overflow:auth')
//Definimos la ruta para hacerle POST
app.post('/signin', async (req, res, next) => {
  // encontramos al usuario de acurdo a su email
  const { email, password } = req.body // encuentra al usuario que tenga este email
  const user = await User.findOne({ email })

  if (!user) {
    debug(`User with email ${email} not found`)
    return handleLoginFailed(res)
  }

  if (!comparePasswords(password, user.password)) {
    debug(`Passwords do not match: ${password} !== ${user.password}`)
    return handleLoginFailed(res, 'El correo y la contraseña no coinciden')
  }
// Creamos los TOKEN de validacion
  const token = createToken(user)
  res.status(200).json({
      //devolvemos al usuario que se realizo correctamente
    message: 'Login succeded',
    token,
    userId: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email
  })   // De esta forma no enviamos el objeto lano, sino encriptado
})
// Funcion para manejar el TOKEN
const createToken = (user) => jwt.sign({ user }, secret, { expiresIn: 86400 })
//-> /api/auth/signup obtenemos los parametros del formulario
app.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password } = req.body
  const u = new User({
    firstName,
    lastName,
    email,
    password: hash(password, 10)
  })
  debug(`Creating new user: ${u}`)
  const user = await u.save()
  const token = createToken(user)
  res.status(201).json({
    message: 'User saved',
    token,
    userId: user._id,
    firstName,
    lastName,
    email
  })
})

function handleLoginFailed(res, message) {
  return res.status(401).json({
    message: 'Login failed',
    error: message || 'Email and password don\'t match'
  })
}

export default app
