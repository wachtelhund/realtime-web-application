import express from 'express'
import { WebhooksController } from '../controllers/webhooks-controller.js'

export const router = express.Router()

const controller = new WebhooksController()

router.post('/', (req, res, next) => controller.index(req, res, next))
