import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { HfInference } from "@huggingface/inference";

export const googleProvider = () => {
  const google = createGoogleGenerativeAI({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_GEMERATIVE_AI_API_KEY || "",
  });

  return google;
};

export const huggingFaceFluxProvider = () => {
  const HfFlux = new HfInference(
    process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY || ""
  );

  return HfFlux;
};
