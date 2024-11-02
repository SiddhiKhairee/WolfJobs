import axios from "axios";
import { aiQuestionsURL } from "./constants";

const generateQuestions = async (
  description: string,
  skill: string
): Promise<any[]> => {
  try {
    const response = await axios.post(aiQuestionsURL, {
      description: description,
      skill: skill,
    });

    if (response.status === 200) {
      return response.data.data;
    } else {
      throw new Error("Invalid response format");
    }
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

export { generateQuestions };
