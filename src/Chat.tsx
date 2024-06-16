import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import { z } from "zod";
import { StructuredOutputParser } from "langchain/output_parsers";
const apiKey = 'api-key';

const model = new ChatGoogleGenerativeAI({  modelName: "gemini-pro",apiKey:apiKey,temperature:0.9});


export async function ask(title:any,desc:any,storyPoints:any)
  {
  const prompt = ChatPromptTemplate.fromTemplate(
    "You are a blog writer who continue the blog, of the topic user is writing about {phrase} and the words limit is 500 and atleast .\n{format_instructions}\n{phrase}"
  );
  const storySchema = z.object({

    subtasks: z.object({
      development:z.object({
        title: z.string().describe("Title of the story"),
        description: z.string().describe("Description of the story"),
        storyPoints: z.number().describe("Story points for the story"),
      }),
      unitTestscase:z.object({
        title: z.string().describe("Title of the story"),
        description: z.string().describe("Description of the story"),
        storyPoints: z.number().describe("Story points for the story"),
      }),
      qa:z.object({
        title: z.string().describe("Title of the story"),
        description: z.string().describe("Description of the story"),
        storyPoints: z.number().describe("Story points for the story"),
      }),
    }).describe("Breakdown of subtasks"),
  });
  
  // Create the output parser
  const outputParser = StructuredOutputParser.fromZodSchema(storySchema);

  const chain=prompt.pipe(model).pipe(outputParser);
  const res= await chain.invoke({
    phrase:` Please break down the following story into subtasks: Title: ${title}, Description: ${desc}, Story Points: ${storyPoints}`,
    format_instructions:outputParser.getFormatInstructions(),
  });
  return res
  console.log(res);
}
