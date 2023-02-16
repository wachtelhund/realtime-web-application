export class WebhooksController {
  indexPost (req, res, next) {
    console.log('Issue webhook received')
    const newIssue = {
      id: req.body.object_attributes.id,
      title: req.body.object_attributes.title,
      description: req.body.object_attributes.description,
      state: req.body.object_attributes.state,
      createdAt: req.body.object_attributes.created_at,
      updatedAt: req.body.object_attributes.updated_at
    }

    console.log(newIssue);
    res.status(200).end()

    if (newIssue) {
      res.io.emit('issue/create', newIssue)
    }
  }
}
