
import express from 'express'
import { IssuesController } from '../controllers/issues-controller.js'

export const router = express.Router()

const controller = new IssuesController()

router.get('/', (req, res, next) => controller.index(req, res, next))
router.post('/toggle', (req, res, next) => controller.toggle(req, res, next))
