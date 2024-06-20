import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import { z } from "zod";
import { StructuredOutputParser } from "langchain/output_parsers";
const apiKey = 'api';

const model = new ChatGoogleGenerativeAI({  modelName: "gemini-pro",apiKey:apiKey,temperature:0.9});


export async function ask(title:any,desc:any,storyPoints:any)
  {
  const prompt = ChatPromptTemplate.fromTemplate(
    "You are an experienced developer who writes code, help the user with your SDLC development knowledge regarding {phrase} and the words limit is 1000 and atleast .\n{format_instructions}\n{phrase}"
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
      length:z.number().describe('length of the subtasks object')
    }).describe("Breakdown of subtasks"),
    unitTest: z.object({
      scenarios: z.string().describe("scenarios based on description"),
    }),
    functionalTesting:z.object({
      scenarios:z.string().describe('Functional testing scenerio'),
    })
  });
  
  // Create the output parser
  const outputParser = StructuredOutputParser.fromZodSchema(storySchema);

  const chain=prompt.pipe(model).pipe(outputParser);
  const res= await chain.invoke({
    phrase:` Please break down the following story into subtasks: Title: ${title}, Description: ${desc},  Story Points: ${storyPoints}, also give unitTest scenarios, functionalTesting scenarios based on ${desc} always use numbers to differentiate between test scenarios.`,
    format_instructions:outputParser.getFormatInstructions(),
  });
  console.log(res);
  return res
}
