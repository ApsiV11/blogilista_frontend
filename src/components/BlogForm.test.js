import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

test('Blog gets created with right info', () => {
    const newBlog = {
        title: 'Pertin blog',
        author: 'Pertti',
        url: 'localhost',
    }

    const mockHandler = jest.fn()

    const component = render(
    <BlogForm handleSubmit={mockHandler} />
    )

    const title = component.container.querySelector('#title')
    const author = component.container.querySelector('#author')
    const url = component.container.querySelector('#url')

    fireEvent.change(title, { target: { value: newBlog.title } })
    fireEvent.change(author, { target: { value: newBlog.author } })
    fireEvent.change(url, { target: { value: newBlog.url } })

    const form = component.container.querySelector('#newForm')
    
    fireEvent.submit(form)

    expect(mockHandler.mock.calls).toHaveLength(1)

    expect(mockHandler.mock.calls[0][1]).toEqual(newBlog)
})