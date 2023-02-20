
import express from 'express'
import { IssuesController } from '../controllers/issues-controller.js'

export const router = express.Router()

const controller = new IssuesController()
// router.use((req, res, next) => {
//   res.io.on('connection', (socket) => {
//     console.log('a user connected')
//     socket.on('issue/toggle', (data) => {
//       console.log('issue/toggle', data)
//     })

//     socket.on('disconnect', () => {
//       console.log('user disconnected')
//     })
//   })
//   next()
// })
router.get('/', (req, res, next) => controller.index(req, res, next))
//router.post('/toggle', (req, res, next) => controller.toggle(req, res, next))
