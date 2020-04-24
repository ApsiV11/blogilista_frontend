import React, { useState, useImperativeHandle } from 'react'

import PropTypes from 'prop-types'

const Togglable = React.forwardRef((props, ref) => {
  const [loginVisible, setLoginVisible] = useState(false)

  const hideWhenVisible = { display: loginVisible ? 'none' : '' }
  const showWhenVisible = { display: loginVisible ? '' : 'none' }

  const toggleVisibility = () => {
    setLoginVisible(!loginVisible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  Togglable.propTypes = {
    button: PropTypes.string.isRequired
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.button}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})

export default Togglable