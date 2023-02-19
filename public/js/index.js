import '../socket.io/socket.io.js'

const issueTemplate = document.querySelector('#issue-template')

if (issueTemplate) {
  const socket = window.io()
  socket.on('issue/create', (issue) => createIssue(issue))
}

const issues = document.querySelectorAll('.issue-card')
issues.forEach((issue) => {
  issue.addEventListener('change', async (event) => {
    if (event.target.checked) {
      event.target.nextElementSibling.textContent = 'closed'
    } else {
      event.target.nextElementSibling.textContent = 'opened'
    }
    console.log(event.target.parentElement.parentElement);
    const body = {
      iid: event.target.parentElement.parentElement.getAttribute('data-iid'),
      state: event.target.nextElementSibling.textContent
    }
    await fetch('./issues/toggle', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  })
})

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
    const title = issueElement.querySelector('.issue-title')
    title.textContent = issue.title
    const aTag = document.createElement('a')
    aTag.setAttribute('href', issue.url)
    aTag.textContent = `#${issue.iid}`
    aTag.classList.add('issue-link')
    title.appendChild(aTag)
    const state = issueElement.firstElementChild.children[0].children[3]
    state.textContent = issue.state
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

  const title = issueElement.firstElementChild.children[0]
  const description = issueElement.firstElementChild.children[1]
  const state = issueElement.firstElementChild.children[3]
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
