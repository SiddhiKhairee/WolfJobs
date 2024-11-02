import { render } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import JobEdit from "../../../src/components/Job/JobEdit";

describe("JobEdit", () => {
  it("renders JobEdit", () => {
    render(
      <MemoryRouter>
        <JobEdit />
      </MemoryRouter>
    );
  });
});
