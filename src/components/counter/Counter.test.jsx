import { describe, it, expect, beforeEach } from "vitest"
import { render, screen,fireEvent } from "@testing-library/react"
import {Counter} from "./Counter"


// delcare set of test case
describe("Counter Component", () => {
  beforeEach(() => {
    render(<Counter />)
  })
// (it) is name of test case
// (expect) is command for inspection
  it("should render counter", () => {
    expect(screen.getByText(/Counter:/)).toBeInTheDocument()
  })

  it("increments counter", () => {
    fireEvent.click(screen.getByText("Increment"))
    expect(screen.getByText("Counter: 1")).toBeInTheDocument()
  })

  it("decrements counter", () => {
    fireEvent.click(screen.getByText("Decrement"))
    expect(screen.getByText("Counter: -1")).toBeInTheDocument()
  })
})