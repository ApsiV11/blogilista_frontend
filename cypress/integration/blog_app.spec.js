describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')

    const user = {
        username: 'apsukka',
        name: 'Aapo Laakkio',
        password: 'sekret'
    }

    cy.request('POST', 'http://localhost:3001/api/users', user)
    cy.visit('http://localhost:3000')
  })
  
  it('Login from is shown', function() {
      cy.get('#loginForm').should('be.visible')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('apsukka')
      cy.get('#password').type('sekret')
      cy.get('button').click()

      cy.contains('Aapo Laakkio logged in')
      cy.contains('blogs')

      cy.get('#notification')
        .should('contain', 'Logged Aapo Laakkio succesfully in')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
    })

    it('fails with wrong credentials', function() {
        cy.get('#username').type('apsukka')
        cy.get('#password').type('wrong')
        cy.get('button').click()
        
        cy.get('#loginForm')
        cy.contains('log in to application')
  
        cy.get('#notification')
          .should('contain', 'wrong credentials')
          .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe.only('When logged in', function() {
      beforeEach(function() {
          cy.login({username: 'apsukka', password: 'sekret'})
      })

      it('A blog can be created', function() {
          cy.contains('new blog').click()

          cy.get('#title').type('Test blog')
          cy.get('#author').type('Tester')
          cy.get('#url').type('localhost')

          cy.get('#submit').click()

          cy.get('#notification')
            .should('contain', 'A new blog Test blog by Tester added')
            .and('have.css', 'color', 'rgb(0, 128, 0)')

          cy.get('.title').first().parent().as('theBlog')

          cy.get('@theBlog').children('.title').should('contain', 'Test blog Tester')

          cy.get('@theBlog').children('.content')
            .should('contain', 'localhost')
            .and('have.css', 'display', 'none')

          cy.get('@theBlog').children('.title').click()

          cy.get('@theBlog').children('.content')
            .should('not.have.css', 'display', 'none')
      })

      describe('A blog', function() {
        beforeEach(function() {
            cy.login({username: 'apsukka', password: 'sekret'})
            cy.createBlog({title: 'Test blog', author: 'Tester', url: 'localhost'})

            const user2 = {
                username: 'test',
                name: 'Tester',
                password: 'sekret'
            }

            cy.request('POST', 'http://localhost:3001/api/users', user2)
            cy.visit('http://localhost:3000')
        })

        it('can be liked', function() {
            cy.contains('Test blog Tester').click().parent().get('.content').as('theContent')

            cy.get('@theContent').contains('like').as('theButton')

            cy.get('@theContent').contains('likes 0')

            cy.get('@theButton').click()

            cy.get('@theContent').contains('likes 1')
        })

        it('can be removed if user is creator', function() {
            cy.login({username: 'test', password: 'sekret'})
            cy.createBlog({title: 'Cannot be deleted', author: 'Another', url: 'localhost'})
            cy.login({username: 'apsukka', password: 'sekret'})
            

            cy.contains('Test blog Tester').click().parent().get('.content').contains('remove').click()
            cy.get('#notification').contains('Successfully deleted Test blog by Tester')
            cy.get('html')
              .should('not.contain', 'Test blog Tester')

            
            cy.contains('Cannot be deleted Another').click().parent().contains('remove').parent()
              .should('have.css', 'display', 'none')
        })
      })

      describe.only('Blogs are', function() {
          beforeEach(function() {
            cy.login({username: 'apsukka', password: 'sekret'})
            
            cy.createBlog({title: 'Blog 1', author: 'Tester', url: 'localhost'})
            cy.createBlog({title: 'Blog 2', author: 'Tester', url: 'localhost'})
            cy.createBlog({title: 'Blog 3', author: 'Tester', url: 'localhost'})

            cy.likeBlog(0, 5)
            cy.likeBlog(1, 2)
            cy.likeBlog(2, 10)
            cy.visit('http://localhost:3000')
          })
          it('sorted in descending order by likes', function() {
              const likes = [10, 5, 2]
              const texts = ['Blog 3', 'Blog 1', 'Blog 2']
              cy.get('.title').each(($title, index) => {
                cy.wrap($title).should('contain', texts[index])
              })

              cy.get('.content').each(($title, index) => {
                cy.wrap($title).should('contain', likes[index])
              })
          })
      })
  })
})