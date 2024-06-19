/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const fs = require('fs');
// const path = require('path');
const {
  StreamingTextResponse,
  createStreamDataTransformer
} = require('ai');
const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { PromptTemplate } = require('@langchain/core/prompts');
const { HttpResponseOutputParser } = require('langchain/output_parsers');
const { JSONLoader } = require('langchain/document_loaders/fs/json');
const { RunnableSequence } = require('@langchain/core/runnables');
const { formatDocumentsAsString } = require('langchain/util/document');

const apiKey = 'api';

const PORT = 3000;

const TEMPLATE = `Act as an AI assistant known as Personal BA and answer the user's questions based only on the following context. If the answer is not in the context, reply politely that you do not have that information available.:
==============================
Context: {context}
==============================
Current conversation: {chat_history}

user: {question}
assistant:`;




const app = express();
app.use(cors());
app.use(bodyParser.json());


const formatMessage = (message) => {
  return `${message.role}: ${message.content}`;
};

app.post('/api', async (req, res) => {
  try {
    const { messages } = req.body;
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;

    const loader = new JSONLoader("./data/data.json");

    const docs = await loader.load();

    const prompt = PromptTemplate.fromTemplate(TEMPLATE);

    const model = new ChatGoogleGenerativeAI({
      apiKey: apiKey,
      model: 'gemini-pro',
      temperature: 0,
      streaming: true,
      verbose: false,
    });

    const parser = new HttpResponseOutputParser();

    const chain = RunnableSequence.from([
      {
        question: (input) => input.question,
        chat_history: (input) => input.chat_history,
        context: () => formatDocumentsAsString(docs),
      },
      prompt,
      model,
      parser,
    ]);
    const stream = await chain.stream({
      chat_history: formattedPreviousMessages.join('\n'),
      question: currentMessageContent,
    });

    const resp = new StreamingTextResponse(
      stream.pipeThrough(createStreamDataTransformer())
    );

    await resp.finished;

    const message = await resp.text();
    const content = message.split("0:").join('').replace(/"/g, '');

    const responseObject = {
      content: `${content}`,
    };

    res.json(responseObject);

    } catch (e) {
        res.status(e.status || 500).json({ error: e.message });
    }
});


app.post('/api/tasks', (req, res) => {
    const task = req.body;
    const tasksFilePath = path.join(__dirname, 'tasks.json');
  
    fs.readFile(tasksFilePath, (err, data) => {
      if (err && err.code !== 'ENOENT') {
        console.error('Error reading tasks file:', err);
        return res.status(500).send('Internal server error');
      }
  
      const tasks = data && data.length ? JSON.parse(data) : [];
      tasks.push(task);
  
      fs.writeFile(tasksFilePath, JSON.stringify(tasks, null, 2), (err) => {
        if (err) {
          console.error('Error writing to tasks file:', err);
          return res.status(500).send('Internal server error');
        }
  
        res.status(200).send('Task saved successfully');
      });
    });
  });
  
  app.get('/api/tasks', (req, res) => {
    const tasksFilePath = path.join(__dirname, 'tasks.json');
  
    fs.readFile(tasksFilePath, (err, data) => {
      if (err) {
        console.error('Error reading tasks file:', err);
        return res.status(500).send('Internal server error');
      }
  
      const tasks = data && data.length ? JSON.parse(data) : [];
      res.status(200).json(tasks);
    });
  });

  

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
