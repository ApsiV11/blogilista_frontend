import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [messageColor, setMessageColor] = useState('red')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if(loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try{
      const response = await loginService.login({ username, password })
      console.log(response)
      setUser(response)

      blogService.setToken(response.token)

      window.localStorage.setItem('loggedUser', JSON.stringify(response))

      setUsername('')
      setPassword('')

      showNotification(`Logged ${response.name} succesfully in`, 'green')
    }
    catch (exception) {
      document.getElementById('loginForm').reset()
      showNotification('wrong credentials', 'red')
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()

    setUser(null)
    blogService.setToken('')
    window.localStorage.removeItem('loggedUser')

    showNotification(`Logged succesfully ${user.name} out`, 'green')
  }

  const handleNewSubmit = async (event, newBlog) => {
    blogFormRef.current.toggleVisibility()
    event.preventDefault()

    blogService.setToken(user.token)

    const addedBlog = await blogService.createNew(newBlog)

    console.log(addedBlog)

    if(addedBlog.error){
      return showNotification(addedBlog.error, 'red')
    }

    document.getElementById('newForm').reset()

    setBlogs(blogs.concat(addedBlog))

    showNotification(`A new blog ${addedBlog.title} by ${addedBlog.author} added`, 'green')
  }

  const likeBlog = async (blog) => {
    const likedBlog = await blogService.likeBlog(blog)

    if(likedBlog.error){
      return showNotification(likedBlog.error, 'red')
    }

    const index = blogs.findIndex((blogInList) => blogInList.id===likedBlog.id)

    const tempBlogs = [...blogs]
    tempBlogs[index]=likedBlog

    console.log(tempBlogs)

    setBlogs(tempBlogs)

    showNotification(`Successfully liked ${likedBlog.title} by ${likedBlog.author}`, 'green')
  }

  const deleteBlog = async (blog) => {
    blogService.setToken(user.token)
    if(window.confirm(`Remove blog ${blog.title} by ${blog.author}`)){
      const deletedBlog = await blogService.deleteBlog(blog)

      if(deletedBlog===204){
        showNotification(`Successfully deleted ${blog.title} by ${blog.author}`, 'green')
      }

      const tempBlogs = blogs.filter((blogInList) => blogInList.id!==blog.id)

      setBlogs(tempBlogs)
    }
  }

  const loginForm = () => (
    <div>
      <h2>log in to application</h2>
      <Notification message={message} color={messageColor} />
      <form id='loginForm' onSubmit={handleLogin}>
        <div>
          username: <input id='username' type='text' onChange={({ target }) => setUsername(target.value)} />
        </div>
        <div>
          password: <input id='password' type='password' onChange={({ target }) => setPassword(target.value)} />
        </div>
        <button type='submit'> login </button>
      </form>
    </div>
  )

  const loggedInInfo = () => (
    <div>
      <h2>blogs</h2>
      <Notification message={message} color={messageColor} />
      <p>
        {user.name} logged in
        <button type='submit' onClick={handleLogout}> logout </button>
      </p>
    </div>
  )

  const blogFormRef=React.createRef()



  const createNewForm = () => (
    <Togglable button='new blog' ref={blogFormRef}>
      <BlogForm handleSubmit={handleNewSubmit} />
    </Togglable>
  )

  const showBlogs = () => (
    <div>
      {blogs.sort((a,b) => b.likes-a.likes).map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          likeBlog={likeBlog}
          deleteBlog={blog.user.username===user.username ? deleteBlog : null} />
      )}
    </div>
  )

  const showNotification = (message, color) => {
    setMessage(message)
    setMessageColor(color)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  return (
    <div>
      {user ?
        <div>
          {loggedInInfo()}
          {createNewForm()}
          {showBlogs()}
        </div>
        :
        <div>
          {loginForm()}
        </div>
      }
    </div>
  )
}

export default App