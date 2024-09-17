import { describe, it, expect, vi, beforeAll} from "vitest"
import { render, fireEvent, waitFor } from "@testing-library/react"
import {RegisterForm} from "./RegisterForm"
import axios from "axios"

// Mock axios to avoid real API calls
vi.mock("axios")

describe("App component", () => {
  beforeAll(() => {
    // Mock window.alert
    // eslint-disable-next-line no-undef
    global.window.alert = vi.fn()
  })
  it("renders the form", () => {
    const { getByLabelText, getByText } = render(<RegisterForm />)
    expect(getByLabelText(/name/i)).toBeInTheDocument()
    expect(getByLabelText(/email/i)).toBeInTheDocument()
    expect(getByLabelText(/phone number/i)).toBeInTheDocument()
    expect(getByText(/submit/i)).toBeInTheDocument()
  })

  it("shows validation errors", () => {
    const { getByText } = render(<RegisterForm />)

    fireEvent.click(getByText(/submit/i))

    expect(getByText(/name is required/i)).toBeInTheDocument()
    expect(getByText(/email is required/i)).toBeInTheDocument()
    expect(getByText(/phone number is required/i)).toBeInTheDocument()
  })

  it("shows validation email format errors", () => {
    const { getByLabelText, getByText } = render(<RegisterForm />)

    fireEvent.change(getByLabelText(/name/i), { target: { value: "John Doe" } })
    fireEvent.change(getByLabelText(/email/i), {
      target: { value: "johndoe@example" },
    })
    fireEvent.change(getByLabelText(/phone number/i), {
      target: { value: "1234567890" },
    })

    fireEvent.click(getByText(/submit/i))

    expect(getByText(/email is invalid/i)).toBeInTheDocument()
  })

  it("submits form successfully", async () => {
    const { getByLabelText, getByText } = render(<RegisterForm />)
    const mockResponse = {
      data: {
        id: 1,
        name: "John Doe",
        email: "johndoe@example.com",
        phoneNumber: "1234567890",
      },
    }
    axios.post.mockResolvedValue(mockResponse)
    fireEvent.change(getByLabelText(/name/i), { target: { value: "John Doe" } })
    fireEvent.change(getByLabelText(/email/i), {
      target: { value: "johndoe@example.com" },
    })
    fireEvent.change(getByLabelText(/phone number/i), {
      target: { value: "1234567890" },
    })

    fireEvent.click(getByText(/submit/i))
// CHECK if data is being sent with this information below.  
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "https://65a25d5342ecd7d7f0a771bd.mockapi.io/users",
        {
          name: "John Doe",
          email: "johndoe@example.com",
          phoneNumber: "1234567890",
        }
      )
    })
  })
})