import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

test('renders title and author but not url nor likes', () => {
  const blog = {
    title: 'Pertin blog',
    author: 'Pertti',
    url: 'localhost',
    user: {
        username: 'apsukka'
    },
    likes: 100
  }

  const component = render(
    <Blog blog={blog} />
  )

  const title = component.container.querySelector('.title')

  const content = component.container.querySelector('.content')

  expect(title).not.toHaveStyle('display: none')

  expect(content).toHaveStyle('display: none')

})

test('renders everything after button has been pressed', () => {
    const blog = {
        title: 'Pertin blog',
        author: 'Pertti',
        url: 'localhost',
        user: {
            username: 'apsukka'
        },
        likes: 100
    }

    const mockHandler = jest.fn()

    const component = render(
    <Blog blog={blog} likeBlog={mockHandler} deleteBlog={mockHandler} />
    )

    const button = component.container.querySelector('.title')

    fireEvent.click(button)

    const content = component.container.querySelector('.content')

    expect(content).not.toHaveStyle('display: none')
})

test('likeBlog gets called two times when like button is clicked two times', () => {
    const blog = {
        title: 'Pertin blog',
        author: 'Pertti',
        url: 'localhost',
        user: {
            username: 'apsukka'
        },
        likes: 100
    }

    const mockHandler = jest.fn()

    const component = render(
    <Blog blog={blog} likeBlog={mockHandler} deleteBlog={mockHandler} />
    )

    const button = component.container.querySelector('.title')

    fireEvent.click(button)

    const likeButton = component.getByText('like')

    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
})