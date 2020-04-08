import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [messageColor, setMessageColor] = useState('red')
  const [newBlog, setNewBlog] = useState({title: '', author: '', url: ''})

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
      const response = await loginService.login({username, password})
      console.log(response)
      setUser(response)

      blogService.setToken(response.token)

      window.localStorage.setItem('loggedUser', JSON.stringify(response))
      
      setUsername('')
      setPassword('')

      showNotification(`Logged succesfully ${response.name} in`, 'green')
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

  const handleNewSubmit = async (event) => {
    event.preventDefault()

    blogService.setToken(user.token)

    const addedBlog = await blogService.createNew(newBlog)

    setNewBlog({title: '', author: '', url: ''})

    if(addedBlog.error!==null){
      return showNotification(addedBlog.error, 'red')
    }

    setBlogs(blogs.concat(addedBlog))

    document.getElementById('newForm').reset()

    showNotification(`A new blog ${addedBlog.title} by ${addedBlog.author} added`, 'green')
  }

  const loginForm = () => (
    <div>
      <h2>log in to application</h2>
      <Notification message={message} color={messageColor} />
      <form id='loginForm' onSubmit={handleLogin}>
        <div>
          username: <input type='text' onChange={({target}) => setUsername(target.value)} />
        </div>
        <div>
          password: <input type='password' onChange={({target}) => setPassword(target.value)} />
        </div>
        <button type='submit'> login </button>
      </form>
    </div>
  )

  const loggedInInfo = () =>(
    <div>
      <h2>blogs</h2>
      <Notification message={message} color={messageColor} />
      <p>
        {user.name} logged in
        <button type='submit' onClick={handleLogout}> logout </button>
      </p>
    </div>
  )

  const createNewForm = () => (
    <form id='newForm' onSubmit={handleNewSubmit}>
      <h2>create new</h2>
      <div>
        title: <input type='text' onChange={({target}) => setNewBlog({...newBlog, title: target.value})} />
      </div>
      <div>
        author: <input type='text' onChange={({target}) => setNewBlog({...newBlog, author: target.value})} />
      </div>
      <div>
        url: <input type='text' onChange={({target}) => setNewBlog({...newBlog, url: target.value})} />
      </div>
      <button type='submit'>create</button>
    </form>
  )

  const showBlogs = () => (
    <div>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
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