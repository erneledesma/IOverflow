import Debug from 'debug'
import { secret } from '../config'
import jwt from 'jsonwebtoken'
// Definimos la clave secreta del TOKEN
const debug = new Debug('i-overflow:auth-middleware')
//agregamos en este middleware solo los usuarios que esten logeado
export const required = (req, res, next) => {
  // verifivamos el token que entregamos al usuairo
//llamamos al metodo
  jwt.verify(req.query.token, secret, (err, token) => {
    if (err) {
      debug('JWTF was not enctrypted with our secret')
      return res.status(401).json({
        message: 'Unauthorized',
        error: err
      })
    }
      // Si no hay error  - verificamos
    debug(`Token verified ${token}`)
    req.user = token.user
    next()
  })
}
