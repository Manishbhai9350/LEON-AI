import { GenerateResult } from "../services/Gemini.js";

export const GetAIResult = async (req, res) => {
    const { prompt } = req.query;

    if (!prompt) {
        return res.status(400).json({
            message: "Prompt is required",
            success: false
        });
    }

    try {
        const final = await GenerateResult(prompt);
        // const final = await GenerateResult(result + '  NOTE! give the response before note! but change the Text and Content for .md file in FileSystem only change the Content and in Text on ly change the Text dont change the name of file or .ext');
        return res.status(200).json({
            result:final,
            success: true
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({
            message: "Something Went Wrong",
            success: false
        });
    }
}
