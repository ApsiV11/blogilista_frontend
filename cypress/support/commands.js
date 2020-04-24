Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:3001/api/login', {
    username, password
  }).then(({ body }) => {
    localStorage.setItem('loggedUser', JSON.stringify(body))
    cy.visit('http://localhost:3000')
  })
})

Cypress.Commands.add('createBlog', ({ title, author, url }) => {
  cy.request({
    url: 'http://localhost:3001/api/blogs',
    method: 'POST',
    body: { title, author, url },
    headers: {
      'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedUser')).token}`
    }
  })
})

Cypress.Commands.add('likeBlog', (index, amount) => {
    cy.request({
      url: 'http://localhost:3001/api/blogs',
      method: 'GET',
      headers: {
        'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedUser')).token}`
      }
    }).then( response => {
        const blogs = [...response.body]

        const blog = blogs[index]

        blog.likes=amount

        cy.request({
            url: `http://localhost:3001/api/blogs/${blog.id}`,
            method: 'PUT',
            body: blog,
            headers: {
                'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedUser')).token}`
              }
        })
    })
  })