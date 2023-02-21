import createError from 'http-errors'
/**
 * WebhooksController
 */
export class WebhooksController {
  /**
   * Receive a POST request from GitLab.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  indexPost (req, res, next) {
    try {
      const newIssue = {
        avatar: req.body.user.avatar_url,
        id: req.body.object_attributes.id,
        iid: req.body.object_attributes.iid,
        url: req.body.object_attributes.url,
        title: req.body.object_attributes.title,
        description: req.body.object_attributes.description,
        state: req.body.object_attributes.state,
        createdAt: req.body.object_attributes.created_at,
        updatedAt: req.body.object_attributes.updated_at
      }

      res.status(200).end()

      if (newIssue) {
        res.io.emit('issue/create', newIssue)
      }
    } catch (error) {
      next(createError(500, 'Internal Server Error'))
    }
  }
}
