import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ChatWindow from "../../../src/components/Chat/ChatWindow";

describe("ChatWindow Component", () => {
  const onCloseMock = vi.fn();
  const sendMessageMock = vi.fn();
  const refreshChatsMock = vi.fn();

  const chatsMock = [
    { fromUser: "user123", message: "Hello", createdAt: new Date().toISOString() },
    { fromUser: "applicant123", message: "Hi", createdAt: new Date().toISOString() },
  ];

  const applicationMock = { _id: "app123", applicantid: "applicant123" };

  beforeEach(() => {
    localStorage.setItem("userId", "user123");
  });

  it("renders chat messages correctly", () => {
    render(
      <ChatWindow
        isOpen={true}
        chats={chatsMock}
        onClose={onCloseMock}
        sendMessage={sendMessageMock}
        refreshChats={refreshChatsMock}
        application={applicationMock}
      />
    );

    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("Hi")).toBeInTheDocument();
    expect(screen.getByText("You")).toBeInTheDocument();
    expect(screen.getByText("Applicant")).toBeInTheDocument();
  });

  it("sends a message and clears the input field on submit", async () => {
    render(
      <ChatWindow
        isOpen={true}
        chats={chatsMock}
        onClose={onCloseMock}
        sendMessage={sendMessageMock}
        refreshChats={refreshChatsMock}
        application={applicationMock}
      />
    );

    const inputField = screen.getByLabelText("Send a message...") as HTMLInputElement;
    fireEvent.change(inputField, { target: { value: "New message" } });
    expect(inputField.value).toBe("New message");

    const sendButton = screen.getByRole("button", { name: /send/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(sendMessageMock).toHaveBeenCalledWith("New message");
      expect(inputField.value).toBe("");
    });
  });
});
