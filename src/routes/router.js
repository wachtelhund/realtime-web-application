import express from 'express'
import createError from 'http-errors'
import { router as homeRouter } from './home-router.js'
import { router as issuesRouter } from './issues-router.js'
import { router as webhooksRouter } from './webhooks-router.js'

export const router = express.Router()

router.use('/', homeRouter)
router.use('/issues', issuesRouter)
router.use('/webhooks', webhooksRouter)

router.use('*', (req, res, next) => {
  next(createError(404, 'Page not found'))
})
