import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import { readMultipartFormData } from 'h3';
import { findOrCreateChat } from '~/server/helpers/chatHelper';
import { saveFile } from '~/server/helpers/fileHelper';

// session
import { getServerSession } from '#auth'


export default defineEventHandler(async (event) => {
  console.log('------API------');

  const session = await getServerSession(event);

  console.log(session);

  try {
    const formData = await readMultipartFormData(event);

    if (!formData) {
      throw createError({ statusCode: 400, message: 'No form data' });
    }

    let fileData;
    let promptUtente;
    let sessionId;
    for (const data of formData) {
      if (data.name === 'file') {
        fileData = data;
      }
      if (data.name === 'promptUtente') {
        promptUtente = data.data.toString();
        console.log('prompt utente:', promptUtente);
      }
      if (data.name === 'sessionId') {
        sessionId = data.data.toString();
        console.log('sessionId:', sessionId);
      }
    }

    console.log('Prompt utente:', promptUtente);


    if (!fileData) {
      throw createError({ statusCode: 400, message: 'No file uploaded' });
    }

    console.log('Received file:', fileData.filename);

    // Salva il file localmente
    const filePath = await saveFile(fileData);

    // Inizializza GoogleAIFileManager
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '');
    const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY ?? '');
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `1. Estrai i concetti più importanti sintetizzando il contenuto del documento.
      2. Non inventare nulla.
      3. Rispondi in italiano, utilizzando i tag HTML per la formattazione del testo (ul, li, ol, h1, h2, p, ecc.) e per la creazione di tabelle (table, thead, tbody, tr, th, td).
      4. Applica le classi di Tailwind CSS per aggiungere stile ed enfatizzare i contenuti più importanti (il testo deve essere bianco/chiaro).
      5. Se ci sono richieste dall'utente rispondi solamente alla richiesta.`,
    });

    // Carica il file su Google AI
    const uploadResponse = await fileManager.uploadFile(filePath, {
      mimeType: "application/pdf",
      displayName: "Document",
    });

    console.log('File caricato con successo:', uploadResponse);

    const prompt = `${promptUtente}.`;


    // const prompt = `il tuo lavoro è di sintetizzare il contenuto del documento in italiano, rispettando la formattazione html del testo e delle tabelle (ul , li , ol , h1 , h..., tb , th , tb ,tr , p .... ). Inoltre, enfatizza i concetti più importanti utilizzando le classi TailwindCSS (font-xl , bold , text-blue .....). Rispetta le richieste dell'utente: ` + promptUtente;

    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResponse.file.mimeType,
          fileUri: uploadResponse.file.uri,
        },
      },
      { text: prompt },
    ]);
    // const responseText = await result.response.text();
    // console.log(result.response.text());

    // Salvataggio chat DB
    let userId = session?.user.id;
    userId = parseInt(userId, 10);

    const chat = await findOrCreateChat(userId, sessionId, promptUtente, result.response.text(), fileData, filePath);

    console.log(chat);

    return {
      statusCode: 200,
      body: {
        result: result,
        chat: chat,
      },
    };
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, message: 'Errore durante il caricamento del file' });
  }
})
