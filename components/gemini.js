import { GoogleGenerativeAI } from "@google/generative-ai";


const GEMINI_API_KEY = "AIzaSyBfnKSt3ZxCPgv__RUJc0313ZaZjUhMY34";

const GeminiService = {
  // Fetch AI response
  async fetchResponse(prompt) {
    const res = {
      success: false,
      response: {},
      errorMessage: "",
      internalError: false,
      result: false,
      error: {},
    };

    try {
      // Initialize Gemini AI
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
//earth is round
      // Create final prompt
      const boilerplatePrompt =
        "Can you please state if the following statement is true or false: ";
      const finalPrompt = boilerplatePrompt + prompt;
// console.log(finalPrompt)
      // Generate content
      const result = await model.generateContent(finalPrompt);
      //console.log(result)
 //console.log(result.response.candidates[0].content.parts[0].text)
      res.success = true;
      res.response = result;
      res.result = result.response.candidates[0].content.parts[0].text
    } catch (error) {
      res.errorMessage = "Unable to fetch response";
      res.internalError = true;
      res.error = error;
    }
    //console.log(res.result)
    return res;
  },
};

export default GeminiService;
