"use server";

import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";
import { GEMINI_1_5_FLASH } from "@/constant/appConstant";
import { googleProvider } from "@/utility/models";

export const generateStreamedTextData = async ({
  messages,
  model = GEMINI_1_5_FLASH,
}) => {
  try {
    console.log(messages);
    const google = googleProvider();
    const generativeModel = google(model);

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
  } catch (error) {
    return {};
  }
};
