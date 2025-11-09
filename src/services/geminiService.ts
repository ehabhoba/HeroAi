import { GoogleGenAI, Chat, Modality, Type, GenerateContentResponse, Content } from "@google/genai";

// As per guidelines, assume process.env.API_KEY is available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// Helper function to convert File to a format suitable for the Gemini API
const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        resolve(''); // Should not happen with readAsDataURL
      }
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

let chatInstance: Chat | null = null;

export const getChat = (): Chat => {
    if (!chatInstance) {
        chatInstance = ai.chats.create({
            model: 'gemini-2.5-pro',
            config: {
                systemInstruction: 'You are an AI assistant specializing in Ancient Egypt, hieroglyphics, and artifacts from the Grand Egyptian Museum. You are knowledgeable, friendly, and provide educational insights. Your name is Thoth. Always respond in the language of the user\'s prompt.',
            },
        });
    }
    return chatInstance;
};

export const sendMessageWithImage = async (chat: Chat, text: string, imageFile: File): Promise<string> => {
    const imagePart = await fileToGenerativePart(imageFile);
    const contents: Content = {
        role: 'user',
        parts: [
            { text },
            imagePart
        ]
    };
    const response = await chat.sendMessage({ contents });
    return response.text;
};

export const analyzeAndTranslateImage = async (imageFile: File, userPrompt: string): Promise<string> => {
    const imagePart = await fileToGenerativePart(imageFile);
    const model = 'gemini-2.5-pro'; 
    const fullPrompt = `You are an expert Egyptologist. Analyze the provided image which contains an artifact with hieroglyphs. ${userPrompt}. 
    Your analysis must be returned as a JSON object that strictly follows this schema:
    {
      "translation": "string",
      "context": "string",
      "symbolism": "string",
      "artifact_type": "string"
    }
    Translate the hieroglyphs, explain the historical context, detail any symbolism, and describe the artifact type.`;

    const response = await ai.models.generateContent({
        model: model,
        contents: { parts: [imagePart, { text: fullPrompt }] },
        config: {
            responseMimeType: 'application/json',
        }
    });
    return response.text;
};

export const generateRealisticRender = async (imageFile: File): Promise<[string, string]> => {
    const imagePart = await fileToGenerativePart(imageFile);
    const prompt = "Re-imagine and render this ancient artifact as a brand new, pristine object on display in a modern museum in the year 2025. The rendering should be photorealistic, with accurate materials, textures, and lighting. Place it on a simple, elegant museum stand with a dark, neutral background. Also, provide a short, one-sentence artistic description of the rendered object.";
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [ imagePart, { text: prompt } ] },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });
    
    let imageUrl = '';
    let description = '';
    
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
      } else if (part.text) {
        description = part.text;
      }
    }
    
    if (imageUrl) {
        return [imageUrl, description];
    }
    
    throw new Error("Could not generate image from response.");
};

export const evaluateQuizAnswer = async (question: string, userAnswer: string): Promise<string> => {
    const model = 'gemini-2.5-pro';
    const prompt = `Question: "${question}"\nUser's Answer: "${userAnswer}"\nEvaluate if the user's answer is correct for the question about ancient Egypt. Provide a brief explanation. Return a JSON object strictly following this schema: {"is_correct": boolean, "explanation": "string"}`;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
        },
    });
    return response.text;
};

export const generateBlogPost = async (topic: string): Promise<string> => {
    const model = 'gemini-2.5-pro';
    const prompt = `Generate a high-quality, SEO-optimized blog post about "${topic}" in the context of Ancient Egypt. The post should be engaging, educational, and around 400 words. It must include a catchy title, an introduction, several paragraphs of content, and a conclusion. Format the entire output as a single Markdown string. Start with a title using a single H1 tag (e.g., # The Secrets of...).`;
    
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
    });
    return response.text;
};


export const generateSpeech = async (text: string, lang: string): Promise<string> => {
    // Determine voice based on language
    const voiceName = lang === 'ar' ? 'Puck' : 'Kore'; // Example voices
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-tts',
        contents: [{ parts: [{ text }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName },
                },
            },
        },
    });
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
        return base64Audio;
    }
    throw new Error("Could not generate speech.");
};