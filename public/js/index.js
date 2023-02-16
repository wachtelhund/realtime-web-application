import '../socket.io/socket.io.js'

const issueTemplate = document.querySelector('#issue-template')

if (issueTemplate) {
  const socket = window.io()
  socket.on('issue/create', (issue) => createIssue(issue))
}

const createIssue = (issue) => {
  const ids = []
  const nodeList = document.querySelector('#issues-list')
  const list = Array.from(nodeList.children)
  list.forEach((issue) => {
    ids.push(parseInt(issue.getAttribute('data-id')))
  })
  if (!ids.includes(issue.id)) {
    const issuesList = document.querySelector('#issues-list')
    const issueElement = document.querySelector('#issue-template').content.cloneNode(true)

    issueElement.querySelector('.issue-card').setAttribute('data-id', issue.id)
    issueElement.querySelector('.issue-title').textContent = issue.title
    issueElement.querySelector('.issue-description').textContent = issue.description
    issueElement.querySelector('.issue-state').textContent = issue.state

    issuesList.appendChild(issueElement)
  }
  else {
    updateIssue(issue)
  }
}

const updateIssue = (issue) => {
  const issues = document.querySelectorAll('.issue-card')

  let issueElement = {}
  issues.forEach((currentIssueElement) => {
    if (parseInt(currentIssueElement.getAttribute('data-id')) === issue.id) {
      issueElement = currentIssueElement
    }
  })

  const title = issueElement.firstElementChild.children[0]
  const description = issueElement.firstElementChild.children[1]
  const state = issueElement.firstElementChild.children[2]
  title.textContent = issue.title
  description.textContent = issue.description
  state.textContent = issue.state
}
