import { render, fireEvent, screen } from '@testing-library/react'

import Button from '../components/ButtonTest'

describe('Button component', () => {
  it('renders the button with the correct label', () => {
    render(<Button onClick={() => {}} label="Click Me" />)
    const buttonElement = screen.getByText(/click me/i)
    expect(buttonElement).toBeInTheDocument()
  })

  it('calls the onClick handler when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick} label="Click Me" />)
    const buttonElement = screen.getByText(/click me/i)
    fireEvent.click(buttonElement)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
