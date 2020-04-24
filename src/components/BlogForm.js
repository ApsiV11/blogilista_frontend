import React, { useState } from 'react'

import PropTypes from 'prop-types'

const BlogForm = (props) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  BlogForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired
  }

  return(
    <form id='newForm' onSubmit={(event) => {props.handleSubmit(event, newBlog); setNewBlog({ title: '', author: '', url: '' })}}>
      <h2>create new</h2>
      <div>
            title: <input id='title' type='text' onChange={({ target }) => setNewBlog({ ...newBlog, title: target.value })} />
      </div>
      <div>
            author: <input id='author' type='text' onChange={({ target }) => setNewBlog({ ...newBlog, author: target.value })} />
      </div>
      <div>
            url: <input id='url' type='text' onChange={({ target }) => setNewBlog({ ...newBlog, url: target.value })} />
      </div>
      <button id='submit' type='submit'>create</button>
    </form>
  )

}

export default BlogForm