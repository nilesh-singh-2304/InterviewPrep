import axios from "axios"
import OpenAI from "openai"
import { coachingOptions } from "./options"
import { Speechify } from "@speechify/api-sdk";

export const getToken = async () => {
    const result = await axios.get("/api/getToken")
    console.log(result)
    return result.data
}

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.NEXT_PUBLIC_OPEN_API_KEY,
    dangerouslyAllowBrowser: true,
  })

export const AiModel = async(topic,coaOptions,lastTwo)=>{

    try {
        const options = await coachingOptions.find((option) => option.name === coaOptions)
        console.log(options)
    const PROMPT = (options?.prompt).replace('{user_topic}',topic)
    const completion = await openai.chat.completions.create({
        model: "deepseek/deepseek-chat-v3-0324:free",
        messages: [
            {role:"assistant",content:PROMPT},
            ...lastTwo
        ],
      })

      if (!completion) {
        console.error("AI Model Error: 123");
        return { role: "assistant", content: "I'm sorry, but I couldn't generate a response." };
      }
      console.log(completion)
      return completion
    } catch (error) {
        console.error("AI Model Err:", error);
        return { role: "assistant", content: "An error occurred while generating a response." };
    }
}


export const speech = async(text,tutor) => {
  const speechify = new Speechify({
    apiKey:"a-Q9hxiSUZg_5T2wgkrwv42ypgbwLnFWxf9oSiF4-u4=",
    strict:false
  });

  const input = text;
  const response = await speechify.audioGenerate({
    input: input,
    voiceId: tutor,
    audioFormat: "mp3",
  });

  const audio = response.audioData;
  const audioBlob = new Blob([audio] , { type: "audio/mp3" });
  const audioUrl = URL.createObjectURL(audioBlob);
  return audioUrl


}


export const AiModelFeedback = async(coaOptions,convo)=>{

  try {
      const options = coachingOptions.find((option) => option.name === coaOptions)
  const PROMPT = (options.summary)
  const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat-v3-0324:free",
      messages: [
        ...convo,
          {role:"assistant",content:PROMPT},
      ],
    })

    if (!completion) {
      console.error("AI Model Error: 123");
      return { role: "assistant", content: "I'm sorry, but I couldn't generate a response." };
    }
    console.log(completion)
    return completion
  } catch (error) {
      console.error("AI Model Err:", error);
      return { role: "assistant", content: "An error occurred while generating a response." };
  }
}
