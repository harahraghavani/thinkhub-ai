"use server";
import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";
import { googleProvider } from "@/utility/models";

export const generateStreamedTextData = async ({ messages, model }) => {
  try {
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
