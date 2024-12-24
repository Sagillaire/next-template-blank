import { render, screen } from "@testing-library/react";
import Page from "app/page";

it("should render home page", () => {
  render(<Page />);
  expect(screen.getByText("Mango Range Aplication")).toBeInTheDocument();
});
