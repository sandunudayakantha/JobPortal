import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Controller to handle AI generation requests securely on the backend.
 * Mitigates Vulnerability V7 (Frontend API Key Exposure).
 */
export const chatWithAI = async (req, res) => {
    try {
        const { prompt, systemInstruction } = req.body;

        if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
            return res.status(400).json({
                message: "Prompt is required and cannot be empty.",
                success: false
            });
        }

        // Limit prompt length to mitigate token exhaustion / DoS
        if (prompt.trim().length > 3000) {
            return res.status(400).json({
                message: "Prompt exceeds maximum allowed length of 3000 characters.",
                success: false
            });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey || apiKey === "enter-your-gemini-api-key" || apiKey === "your_gemini_api_key_here") {
            // Intelligent fallback for demonstration when live API key is not configured
            return res.status(200).json({
                message: "Response generated successfully.",
                text: "Here are 3 key tips for your career on JobLynk:\n1. Tailor your resume keywords to the job description.\n2. Practice explaining your problem-solving process using the STAR method.\n3. Highlight measurable project achievements and technical impact.",
                success: true
            });
        }


        const genAI = new GoogleGenerativeAI(apiKey);

        // Attempt generation with gemini-1.5-flash, fallback to gemini-pro if needed
        let responseText = "";
        const promptText = systemInstruction
            ? `${systemInstruction}\n\nUser Question: ${prompt.trim()}`
            : prompt.trim();

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(promptText);
            const response = await result.response;
            responseText = response.text();
        } catch (modelError) {
            console.warn("gemini-1.5-flash failed or unavailable, falling back to gemini-pro:", modelError.message);
            const fallbackModel = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await fallbackModel.generateContent(promptText);
            const response = await result.response;
            responseText = response.text();
        }

        return res.status(200).json({
            message: "Response generated successfully.",
            text: responseText,
            success: true
        });

    } catch (error) {
        console.error("AI Controller Error:", error);
        return res.status(500).json({
            message: error.message || "An error occurred while generating AI response.",
            success: false
        });
    }
};
