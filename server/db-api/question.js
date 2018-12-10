import Debug from 'debug'
import { Question, Answer } from '../models'

const debug = new Debug('ideas-overflow:db-api:question')
//Este modulo le pide al modulo le pide al modelo de preguntas que nos devuelva todas las preguntas que encuentre en la BBDD
export default {
  findAll: (sort = '-createdAt') => {
    debug('Finding all questions')
    return Question.find().populate('answers').sort(sort) // nos trea todas las preguntas y respuestas de las BBDD
  },
// agregamos el metodo para los id de bd que queemos buscar
  findById: async (_id) => {
    debug(`Find question with id ${_id}`)
    return await Question
      .findOne({ _id }) // le pasamos el id
      .populate('user')
      .populate({
        path: 'answers',
        options: { sort: '-createdAt' },//campo de fecha de creacion de manera descendiente
        populate: { // el autor de cada una de las respuestas
          path: 'user',
          model: 'User'
        }
      })
  },

  create: (q) => {
    debug(`Creando una nueva pregunta ${q}`)
    const question = new Question(q) // creamos una nueva question
    return question.save()
  },

  createAnswer: async (q, a) => {
    const answer = new Answer(a)
    const savedAnswer = await answer.save()
    q.answers.push(savedAnswer)
    await q.save()
    return savedAnswer
  }
}
