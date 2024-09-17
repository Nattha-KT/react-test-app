import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import axios from "axios";
import {UserList} from "./UserList";
import {mockUsers} from "../../constants";

// Mock axios
vi.mock("axios");

describe("UserList component", () => {


  
  it("renders the table successfully when API call succeeds", async () => {
    axios.get.mockResolvedValue({ data: mockUsers });
    render(<UserList />);

    await waitFor(() => {
      expect(screen.getByText("ishappy")).toBeInTheDocument();
      expect(screen.getByText("ishappy@happy")).toBeInTheDocument();
    });
  });

  //Search Variants:https://testing-library.com/docs/vue-testing-library/cheatsheet/
  it("filters users based on search input", async () => {
    axios.get.mockResolvedValue({ data: mockUsers });
    render(<UserList />);

    await waitFor(() => {
      fireEvent.change(screen.getByPlaceholderText("Search by name or email"), {
        target: { value: "ishappy" },
      });
      expect(screen.getByText("ishappy")).toBeInTheDocument();
      expect(screen.queryByText("non")).not.toBeInTheDocument();
    });
  });

  it("handles API failure without problems and still renders", async () => {
    axios.get.mockRejectedValue(new Error("API call failed"));
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<UserList />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching users:",
        expect.any(Error)
      );
      expect(
        screen.getByPlaceholderText("Search by name or email")
      ).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });
});
