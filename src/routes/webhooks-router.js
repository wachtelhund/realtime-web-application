import createError from 'http-errors'
import express from 'express'
import { WebhooksController } from '../controllers/webhooks-controller.js'

export const router = express.Router()

const controller = new WebhooksController()

const authenticate = ((req, res, next) => {
  if (req.headers['x-github-token'] === process.env.WEBHOOK_SECRET) {
    next()
  } else {
    next(createError(401, 'Unauthorized'))
  }
})

router.post('/', (req, res, next) => controller.indexPost(req, res, next))
