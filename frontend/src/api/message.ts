import axios from 'axios';
import { createMessageURL, fetchMessageURL, fetchListingChatsURL } from './constants';

const fetchMessages = async (applicationId: string): Promise<any[]> => {
    try {
        const response = await axios.get(fetchMessageURL, {
          params: { applicationId },
        });
    
        if (response.status === 200 && response.data.data && Array.isArray(response.data.data)) {
          return response.data.data;
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }
}

const sendMessage = async (message: string, fromUser: string, toUser: string, applicationId: string): Promise<any[]> => {
  try {
      const response = await axios.post(createMessageURL, {
        fromUser: fromUser,
        toUser: toUser,
        message: message,
        applicationId: applicationId
      });
  
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
}

const fetchListingChats = async (jobId: string): Promise<any[]> => {
  try {
      const response = await axios.get(fetchListingChatsURL, {
        params: { jobId },
      });
  
      if (response.status === 200 && response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
}

export { fetchMessages, sendMessage, fetchListingChats };