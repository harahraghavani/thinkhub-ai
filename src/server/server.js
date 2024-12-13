"use server";
import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";
import { googleProvider, huggingFaceFluxProvider } from "@/utility/models";
import { v2 as cloudinary } from "cloudinary";
import { FLUX_1_SCHNELL } from "@/constant/appConstant";

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
}) => {
  try {
    // ------ GOOGLE PROVIDER ------
    const google = googleProvider();
    const generativeModel = google(model);

    // ----- HUGGING FACE PROVIDER ------
    const huggingFace = huggingFaceFluxProvider();

    if (isImageGeneration) {
      const response = await huggingFace.textToImage({
        inputs: prompt?.trim(),
        model: FLUX_1_SCHNELL,
        parameters: {
          height: 1024,
          width: 1024,
          num_inference_steps: 4,
        },
      });

      const imageBuffer = await response.arrayBuffer();

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
    return {};
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
