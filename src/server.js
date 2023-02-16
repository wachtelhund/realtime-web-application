import express from 'express'
import expressLayouts from 'express-ejs-layouts'
import session from 'express-session'
import logger from 'morgan'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { router } from './routes/router.js'

import { createServer } from 'node:http'
import { Server } from 'socket.io'

try {
  const app = express()

  const httpServer = createServer(app)
  const io = new Server(httpServer)

  app.use(logger('dev'))
  if (process.env.NODE_ENV === 'development') {
    io.on('connection', (socket) => {
      console.log('a user connected')

      socket.on('disconnect', () => {
        console.log('user disconnected')
      })
    })
  }

  const dirFullName = dirname(fileURLToPath(import.meta.url))
  const baseURL = process.env.BASE_URL || '/'

  app.set('view engine', 'ejs')
  app.set('views', join(dirFullName, 'views'))
  app.use(expressLayouts)
  app.set('layout', join(dirFullName, 'views', 'layouts', 'default'))

  app.use(express.urlencoded({ extended: false }))
  app.use(express.json())
  app.use(express.static(join(dirFullName, '..', 'public')))

  const sessionOptions = {
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: 'strict'
    }
  }

  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1)
    sessionOptions.cookie.secure = true
  }

  app.use(session(sessionOptions))

  app.use((req, res, next) => {
    if (req.session.flash) {
      res.locals.flash = req.session.flash
      delete req.session.flash
    }

    res.locals.baseURL = baseURL
    res.io = io

    next()
  })

  app.use(baseURL, router)

  app.use(async function (err, req, res, next) {
    // if (req.originalURL.includes('/webhooks')) {
    //   return res
    //     .status(err.status || 500)
    //     .end(err.message)
    // }

    if (err.status === 404) {
      return res
        .status(404)
        .sendFile(join(dirFullName, 'views', 'errors', '404.html'))
    }

    if (req.app.get('env') !== 'development') {
      return res
        .status(err.status || 500)
        .sendFile(join(dirFullName, 'views', 'errors', '500.html'))
    }
  })

  httpServer.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`)
  })
} catch (error) {
  console.error(error)
  process.exitCode = 1
}
