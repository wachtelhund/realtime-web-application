import '../socket.io/socket.io.js'

const base = document.querySelector('base')
const path = base
  ? (new URL('socket.io', base.href)).pathname
  : '/socket.io'
const socket = window.io.connect('/', { path })

const issueTemplate = document.querySelector('#issue-template')

if (issueTemplate) {
  addEventListener('DOMContentLoaded', () => {
    addListeners()
  })
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
    issueElement.querySelector('.issue-card').setAttribute('data-iid', issue.iid)
    issueElement.querySelector('.card-text').textContent = issue.description
    issueElement.querySelector('.user-avatar').setAttribute('src', issue.avatar)
    const title = issueElement.querySelector('.issue-title')
    title.textContent = issue.title
    const aTag = document.createElement('a')
    aTag.setAttribute('href', issue.url)
    aTag.textContent = `#${issue.iid}`
    aTag.classList.add('issue-link')
    title.appendChild(aTag)
    const state = issueElement.firstElementChild.children[0].children[3]
    state.nextElementSibling.textContent = issue.state
    state.nextElementSibling.setAttribute('for', `state-checkbox-${issue.id}`)
    state.setAttribute('id', `state-checkbox-${issue.id}`)
    if (issue.state === 'closed') {
      state.previousElementSibling.checked = true
    } else {
      state.previousElementSibling.checked = false
    }

    issuesList.appendChild(issueElement)
  } else {
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

  const title = issueElement.firstElementChild.children[1]
  const description = issueElement.firstElementChild.children[2]
  const state = issueElement.firstElementChild.children[4]
  const link = title.firstElementChild
  link.textContent = `#${issue.iid}`
  link.href = issue.url
  title.textContent = issue.title + ' '
  title.appendChild(link)
  description.textContent = issue.description
  state.textContent = issue.state
  if (issue.state === 'closed') {
    state.previousElementSibling.checked = true
  } else {
    state.previousElementSibling.checked = false
  }
}

function addListeners() {
  const issuesList = document.querySelector('#issues-list')
  issuesList.addEventListener('change', (event) => {
    toggleState(event)
  })
}

async function toggleState (event) {
  if (event.target.checked) {
    event.target.nextElementSibling.textContent = 'closed'
  } else {
    event.target.nextElementSibling.textContent = 'opened'
  }
  const body = {
    iid: event.target.parentElement.parentElement.getAttribute('data-iid'),
    state: event.target.nextElementSibling.textContent
  }
  socket.emit('issue/toggle', body)
}
