"use server";
import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";
import { googleProvider, huggingFaceFluxProvider } from "@/utility/models";
import { CLOUDINARY_CONFIG } from "@/config/CloudinaryConfig";
import { v2 as cloudinary } from "cloudinary";

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
        model: "black-forest-labs/FLUX.1-schnell",
        parameters: {
          height: 512,
          width: 512,
        },
      });

      const imageBuffer = await response.arrayBuffer();

      // Upload the image buffer to Cloudinary
      const uploadToCloudinary = async (imageName) => {
        try {
          const result = await cloudinary.uploader.upload(
            `data:image/png;base64,${Buffer.from(imageBuffer).toString(
              "base64"
            )}`,
            { resource_type: "image", public_id: imageName }
          );
          return result;
        } catch (error) {
          throw error;
        }
      };

      const uploadedImage = await uploadToCloudinary(
        `intelliHub-ai-generated-${Math.random()}`
      );

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
