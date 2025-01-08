"use server";
import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";
import { googleProvider, huggingFaceFluxProvider } from "@/utility/models";
import { v2 as cloudinary } from "cloudinary";
import {
  FLUX_1_SCHNELL,
  ratioDimensions,
  stylePrompts,
} from "@/constant/appConstant";

const cloudinaryConfig = {
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

cloudinary.config(cloudinaryConfig);

export const generateStreamedTextData = async ({
  messages,
  prompt,
  model,
  isImageGeneration = false,
  style,
  ratio,
}) => {
  try {
    // ------ GOOGLE PROVIDER ------
    const google = googleProvider();
    const generativeModel = google(model);

    // ----- HUGGING FACE PROVIDER ------
    const huggingFace = huggingFaceFluxProvider();

    if (isImageGeneration) {
      const selectedStylePrompt = stylePrompts[style] || "";
      const dimensions = ratioDimensions[ratio] || {
        width: 1080,
        height: 1080,
      };

      const finalPrompt = `${prompt?.trim()} ${selectedStylePrompt}`;

      const response = await huggingFace.textToImage({
        inputs: finalPrompt,
        model: FLUX_1_SCHNELL,
        parameters: {
          height: dimensions.height,
          width: dimensions.width,
          num_inference_steps: 7,
        },
      });

      const imageBuffer = await response?.arrayBuffer();

      // Upload the image buffer to Cloudinary
      const uploadToCloudinary = async ({ imageName }) => {
        try {
          const result = await cloudinary.uploader.upload(
            `data:image/png;base64,${Buffer.from(imageBuffer).toString(
              "base64"
            )}`,
            {
              resource_type: "image",
              public_id: imageName,
              quality_analysis: true,
            }
          );
          return result;
        } catch (error) {
          throw error;
        }
      };

      const uploadedImage = await uploadToCloudinary({
        imageName: `intelliHub-ai-generated-${1 + Math.random()}`,
      });

      return { output: uploadedImage };
    } else {
      let stream = createStreamableValue("");

      (async () => {
        const { textStream } = await streamText({
          model: generativeModel,
          messages,
        });

        for await (const delta of textStream) {
          stream.update(delta);
        }

        stream.done();
      })();

      return { output: stream.value };
    }
  } catch (error) {
    console.log("error: ", error);
    return {
      output: null,
      isError: true,
      error: error.message || "An unexpected error occurred.",
    };
  }
};

export const deleteFile = async ({ sourceFilePath }) => {
  try {
    const result = await cloudinary.uploader.destroy(sourceFilePath);
    return { isSuccess: true };
  } catch (error) {
    return { isSuccess: false };
  }
};
