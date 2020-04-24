import React from 'react'

import PropTypes from 'prop-types'

const Notification = ({ message, color }) => {
  const notificationStyle = {
    color: color,
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }

  if (message === null) {
    return null
  }

  Notification.propTypes = {
    message: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired
  }

  return (
    <div id='notification' style={notificationStyle}>
      {message}
    </div>
  )
}

export default Notification