import axios from 'axios'
const baseUrl = '/api/blogs'

let token = ''

const setToken = (string) => {
  token = `bearer ${string}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createNew = async (blog) => {
  const config = {
    headers: { Authorization: token },
  }

  if(blog.title==='' || blog.author===''){
    return { error: 'Title or author can\'t be empty' }
  }

  const response = await axios.post(baseUrl, blog, config)
  return response.data
}

const likeBlog = async (blog) => {
  const config = {
    headers: { Authorization: token },
  }

  if(!blog){
    return { error: 'Blog is invalid' }
  }
  blog.likes++

  const response = await axios.put(`${baseUrl}/${blog.id}`, blog, config)

  return response.data
}

const deleteBlog = async (blog) => {
  const config = {
    headers: { Authorization: token },
  }

  if(!blog){
    return { error: 'Blog is invalid' }
  }

  const response = await axios.delete(`${baseUrl}/${blog.id}`, config)

  return response.status
}

export default { getAll, createNew, deleteBlog, likeBlog, setToken }