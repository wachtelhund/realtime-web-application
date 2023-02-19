/**
 * IssuesController.
 */
export class IssuesController {
  #CONNECTION_STRING = 'https://gitlab.lnu.se/api/v4/projects/30073/' // issues?private_token=${process.env.GITLAB_TOKEN}`
  /**
   * Renders the issues view.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    const data = await fetch(`${this.#CONNECTION_STRING}issues?private_token=${process.env.GITLAB_TOKEN}`)
    if (!data.ok) {
      req.session.flash = { type: 'danger', text: 'Could not fetch issues.' }
      res.redirect('/home')
    }
    const issues = await data.json()
    const viewData = {}
    viewData.issues = issues.map((issue) => {
      return {
        id: issue.id,
        iid: issue.iid,
        url: issue.web_url,
        title: issue.title,
        description: issue.description,
        state: issue.state,
        createdAt: issue.created_at,
        updatedAt: issue.updated_at
      }
    })
    console.log(viewData.issues)
    res.render('issues/index', { viewData })
  }

  async toggle (req, res, next) {
    console.log(req.body);
    let newState = ''
    if (req.body.state === 'closed') {
      newState = 'close'
    } else {
      newState = 'reopen'
    }
    const response = await fetch(`${this.#CONNECTION_STRING}issues/${req.body.iid}?private_token=${process.env.GITLAB_TOKEN}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ state_event: newState })
    })

    if (!response.ok) {
      const data = await response.json()
      console.log(data);
    }
  }
}
