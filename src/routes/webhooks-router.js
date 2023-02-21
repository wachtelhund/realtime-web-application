import createError from 'http-errors'
import express from 'express'
import { WebhooksController } from '../controllers/webhooks-controller.js'
/**
 * Webhooks Router.
 */
export const router = express.Router()

const controller = new WebhooksController()

/**
 * Authenticate the request from GitLab.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const authenticate = (req, res, next) => {
  if (req.get('x-gitlab-token') === process.env.WEBHOOK_SECRET) {
    next()
  } else {
    next(createError(401, 'Unauthorized'))
  }
}

router.post('/', authenticate, (req, res, next) => controller.indexPost(req, res, next))
