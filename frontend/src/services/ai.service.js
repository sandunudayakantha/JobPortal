import axios from 'axios';
import { AI_API_END_POINT } from '../utils/constant';

class AIService {
  async generateResponse(prompt) {
    try {
      const response = await axios.post(
        `${AI_API_END_POINT}/chat`,
        { prompt },
        { withCredentials: true }
      );

      if (response.data?.success) {
        return response.data.text;
      }
      throw new Error(response.data?.message || 'Failed to generate AI response.');
    } catch (error) {
      console.error('Error generating AI response:', error);
      throw error;
    }
  }
}

export const aiService = new AIService();
 