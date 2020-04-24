import React, { useState } from 'react'

import PropTypes from 'prop-types'

const Blog = ({ blog, likeBlog, deleteBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [infoVisible, setInfoVisible] = useState(false)

  const showInfo = { display: infoVisible ? '' : 'none' }
  const showDelete = { display: deleteBlog ? '' : 'none' }

  Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    likeBlog: PropTypes.func.isRequired,
    deleteBlog: PropTypes.func.isRequired
  }


  return(
    <div style={blogStyle}>
      <div className='title' onClick={() => setInfoVisible(!infoVisible)}>
        {blog.title} {blog.author}
      </div>
      <div className='content' style={showInfo}>
        <div>{blog.url}</div>
        <div>likes {blog.likes} <button onClick={() => likeBlog(blog)}>like</button></div>
        <div>{blog.user.name}</div>
        <div style={showDelete}><button onClick={() => deleteBlog(blog)}>remove</button></div>
      </div>
    </div>
  )
}

export default Blog
