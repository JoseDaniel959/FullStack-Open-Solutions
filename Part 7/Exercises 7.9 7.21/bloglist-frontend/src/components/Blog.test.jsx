import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const ExampleBlog = {
    title : "Titulo",
    author : "Jose Daniel",
    url : "www.google.com",
    likes: 1

}

test('renders a blog',()=>{
    

    render(<Blog blog={ExampleBlog}/>)
    const element = screen.getByText('Titulo Jose Daniel')
    expect(element).toBeDefined()
    
})

test('When clicking button information must be shown', async ()=>{
    
    const mockHandler = vi.fn()
    const container = render(<Blog blog={ExampleBlog}/>).container
    const user = userEvent.setup()
    const button = screen.getByText('View')
    await user.click(button)
    screen.debug()
    const div = container.querySelector('.toggable')
    expect(div).not.toHaveStyle('display: none')

})

