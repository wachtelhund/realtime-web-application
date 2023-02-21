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
        avatar: issue.author.avatar_url,
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
    res.render('issues/index', { viewData })
  }

  /**
   * Toggle the state of an issue.
   *
   * @param {object} data - The issue data.
   */
  async toggle (data) {
    let newState = ''
    if (data.state === 'closed') {
      newState = 'close'
    } else {
      newState = 'reopen'
    }

    const res = await fetch(`${this.#CONNECTION_STRING}issues/${data.iid}?private_token=${process.env.GITLAB_TOKEN}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ state_event: newState })
    })

    if (!res.ok) {
      throw new Error('Could not toggle issue state.')
    }
  }
}
