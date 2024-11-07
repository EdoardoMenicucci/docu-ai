import { getServerSession } from '#auth'
import { insertMessage, findChatById, insertAIResponse } from '~/server/helpers/chatHelper';
import { saveFile } from '~/server/helpers/fileHelper';
// ai
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
//gestione file locale
import axios from 'axios';


// Create a new message

export default defineEventHandler(async (event) => {

  // read multipart form data
  const formData = await readMultipartFormData(event);

  try {
    if (!formData) {
      throw createError({ statusCode: 400, message: 'No form data' });
    }

    let chatId;
    let userMessage

    for (const data of formData) {
      if (data.name === 'chatId') {
        chatId = data.data.toString();
        console.log('chatId:', chatId);
      }
      if (data.name === 'prompt') {
        userMessage = data.data.toString();
        console.log('message:', userMessage);
      }
    }

    if (!chatId) {
      throw createError({ statusCode: 400, message: 'No chatId' });
    }

    if (!userMessage) {
      throw createError({ statusCode: 400, message: 'No message' });
    }

    // Create a new Message
    console.log('---Create Message---');
    insertMessage(parseInt(chatId), userMessage);
    // get chat back
    let chat = await findChatById(parseInt(chatId));

    let file = chat?.files[0].fileUrl;

    console.log(file);

    if (!file) {
      throw createError({ statusCode: 400, message: 'No file' });
    }

    // CREATE A LOCAL TEMPORARY FILE ----------------------------------
    const { data } = await axios.get(file, { responseType: 'arraybuffer' });

    // Salva il file PDF temporaneamente
    const tempFilePath = await saveFile({ data, filename: 'temp.pdf' });



    // Inizializza GoogleAIFileManager
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '');
    const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY ?? '');
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `1. Estrai i concetti più importanti sintetizzando il contenuto del documento.
      2. Non inventare nulla.
      3. Rispondi in italiano, utilizzando i tag HTML per la formattazione del testo (ul, li, ol, h1, h2, p, ecc.) e per la creazione di tabelle (table, thead, tbody, tr, th, td).
      4. Applica le classi di Tailwind CSS per aggiungere stile ed enfatizzare i contenuti più importanti (il testo deve essere bianco/chiaro).
      5. Se ci sono richieste dall'utente rispondi solamente alla richiesta dell utente.`,
    });

    // Carica il file su Google AI
    const uploadResponse = await fileManager.uploadFile(tempFilePath as string, {
      mimeType: "application/pdf",
      displayName: "Document",
    });

    console.log('File caricato con successo:', uploadResponse);

    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResponse.file.mimeType,
          fileUri: uploadResponse.file.uri,
        },
      },
      { text: userMessage },
    ]);

    const res = result.response.text();


    insertAIResponse(parseInt(chatId), res);

    return {
      statusCode: 200,
      body: {
        message: 'messagio creato e risposta AI inserita',
      },
    }
  } catch (error) {
    console.error(error);
  }
})
