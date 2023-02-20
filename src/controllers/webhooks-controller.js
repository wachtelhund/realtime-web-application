import createError from 'http-errors'
export class WebhooksController {
  indexPost (req, res, next) {
    try {
      console.log('Issue webhook received')
      console.log(req.body);
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
