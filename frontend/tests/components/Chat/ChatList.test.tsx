import React from 'react';
import { render, screen } from '@testing-library/react';
import ChatList from '../../../src/components/Chat/ChatList'; // Adjust the path according to your project structure

describe('ChatList component', () => {
  const mockChats = [
    {
      applicationId: '123',
      applicantName: 'John Doe',
      lastMessage: {
        message: 'Hello!',
        createdAt: new Date('2023-01-01T12:00:00Z'),
      },
    },
    {
      applicationId: '456',
      applicantName: 'Jane Smith',
      lastMessage: {
        message: 'Hi there!',
        createdAt: new Date('2023-01-01T13:30:00Z'),
      },
    },
  ];

  const mockOnSelectChat = () => {};

  it('renders the correct number of chat items', () => {
    render(<ChatList chats={mockChats} onSelectChat={mockOnSelectChat} />);
    
    const listItems = screen.getAllByRole('listitem');
    expect(listItems.length).toBe(mockChats.length);
  });

  it('displays the applicant name for each chat', () => {
    render(<ChatList chats={mockChats} onSelectChat={mockOnSelectChat} />);
    
    mockChats.forEach((chat) => {
      const applicantName = screen.getByText(chat.applicantName);
      expect(applicantName).toBeInTheDocument();
    });
  });

  it('renders a Divider at the end of the list', () => {
    render(<ChatList chats={mockChats} onSelectChat={mockOnSelectChat} />);
    
    const divider = screen.getByRole('separator');
    expect(divider).toBeInTheDocument();
  });
});
