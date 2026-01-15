import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Home Page", () => {
  it("renders the home page heading", () => {
    render(<Home />);
    const heading = screen.getByRole("heading", {
      name: /to get started, edit the page.tsx file/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it("renders deployment link", () => {
    render(<Home />);
    const deployLink = screen.getByRole("link", { name: /deploy now/i });
    expect(deployLink).toBeInTheDocument();
    expect(deployLink).toHaveAttribute("target", "_blank");
  });

  it("renders documentation link", () => {
    render(<Home />);
    const docLink = screen.getByRole("link", { name: /documentation/i });
    expect(docLink).toBeInTheDocument();
  });

  it("renders learning center link", () => {
    render(<Home />);
    const learningLink = screen.getByRole("link", { name: /learning/i });
    expect(learningLink).toBeInTheDocument();
  });
});
