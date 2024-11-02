import { render } from "@testing-library/react";
import JobQuestionnaire from "../../../src/Pages/CreateJob/jobQuestionnaire";
import { MemoryRouter, Route, Routes } from "react-router-dom";

describe("JobQuestionnaire", () => {
  it("renders JobQuestionnaire with state", () => {
    const initialState = {
      description: "Test job description",
      requiredSkills: ["Skill 1", "Skill 2"],
    };

    render(
      <MemoryRouter initialEntries={[{ pathname: "/create-job", state: initialState }]}>
        <Routes>
          <Route path="/create-job" element={<JobQuestionnaire />} />
        </Routes>
      </MemoryRouter>
    );
  });
});
