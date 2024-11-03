import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ChatView from '../../../src/components/Chat/ChatView';

describe("ChatView Component", () => {
    const selectedChatMock = {
      applicantId: "applicant123",
      applicationId: "application456",
      applicantName: "John Doe",
      messages: [
        {
          _id: "message1",
          message: "Hello",
          fromUser: "applicant123",
          createdAt: new Date().toISOString(),
        },
      ],
    };
  
    const refreshChatsMock = vi.fn();
  
    it("renders component with messages and allows sending new messages", async () => {
      render(<ChatView selectedChat={selectedChatMock} refreshChats={refreshChatsMock} />);
  
      // Check if message list renders
      expect(screen.getByText("Hello")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
  
      // Find and interact with input field
      const inputField = screen.getByLabelText("Type a message...") as HTMLInputElement;
      fireEvent.change(inputField, { target: { value: "Hi there!" } });
      expect(inputField.value).toBe("Hi there!");
  
      // Submit the form
      const submitButton = screen.getByRole("button", { name: /send/i });
      fireEvent.click(submitButton);
  
      // Ensure input clears after sending
      await waitFor(() => expect(inputField.value).toBe(""));
    });
  });