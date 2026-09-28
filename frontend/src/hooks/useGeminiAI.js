import { useState } from "react";
import axios from "axios";
import { AI_API_END_POINT } from "@/utils/constant";

const useGeminiAI = () => {
  const [loading, setLoading] = useState(false);

  const generateContent = async (prompt, systemInstruction = "") => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await axios.post(
        `${AI_API_END_POINT}/chat`,
        { prompt, systemInstruction },
        { 
          headers,
          withCredentials: true 
        }
      );

      if (res.data?.success) {
        return res.data.text;
      }
      throw new Error(res.data?.message || "Failed to generate AI response.");
    } catch (error) {
      console.error("AI Generation Error:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to generate AI response.";
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { generateContent, loading };
};

export default useGeminiAI;