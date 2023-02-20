import createError from 'http-errors'
import express from 'express'
import { WebhooksController } from '../controllers/webhooks-controller.js'

export const router = express.Router()

const controller = new WebhooksController()

const authenticate = ((req, res, next) => {
  if (req.get('x-gitlab-token') === process.env.WEBHOOK_SECRET) {
    next()
  } else {
    console.log(req.headers);
    next(createError(401, 'Unauthorized'))
  }
})

router.post('/', authenticate, (req, res, next) => controller.indexPost(req, res, next))
