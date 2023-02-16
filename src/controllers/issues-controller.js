/**
 * IssuesController.
 */
export class IssuesController {
  /**
   * Renders the issues view.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  index (req, res, next) {
    res.render('issues/index')
  }
}
