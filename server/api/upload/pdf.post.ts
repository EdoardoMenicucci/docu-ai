import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import { readMultipartFormData } from 'h3';

import fs from 'fs/promises';
import path from 'path';
import os from 'os';



export default defineEventHandler(async (event) => {
  console.log('--------------------------API---------------------------------');

  const body = await readBody(event)
  const headers = getHeaders(event)
  // console.log(body, headers);
  try {
    const formData = await readMultipartFormData(event);

    if (!formData) {
      throw createError({ statusCode: 400, message: 'No form data' });
    }
    let fileData;
    let promptUtente;
    for (const data of formData) {
      if (data.name === 'file') {
        fileData = data;
      }
      if (data.name === 'promptUtente') {
        console.log('prompt utente:', data);
        promptUtente = data;
      }
    }

    if (!fileData) {
      throw createError({ statusCode: 400, message: 'No file uploaded' });
    }

    console.log('Received file:', fileData.filename);

    // Salva il file localmente
    // Salva il file localmente nella directory temporanea del sistema operativo
    const tempDir = os.tmpdir();
    const filePath = path.join(tempDir, fileData.filename ?? '');
    await fs.writeFile(filePath, fileData.data);

    // fileData.data is a Buffer containing the file content
    // const fileDataBase64 = fileData.data.toString('base64');

    // Inizializza GoogleAIFileManager
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '');
    const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY ?? '');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Carica il file su Google AI
    const uploadResponse = await fileManager.uploadFile(filePath, {
      mimeType: "application/pdf",
      displayName: "Document",
    });

    console.log('File caricato con successo:', uploadResponse);


    // Prompt
    const prompt = `**Estrai i concetti di maggiore importanza sintetizzando molto brevemente il contenuto del documento e rispondi in italiano. non inventarti nulla, solo quello che estrai dal documento. rispondi rispettando i tag html per la formattazione del testo e utilizza classi Tailwind per aggiungere stile come enfasi dei contenuti piu importanti **CREA TABELLE SE NECESSARIO**  **EVITA TAG HEAD, BODY, STYLE** **SENTITI LIBERO DI UTILIZZARI ANCHE COLORI COME ENFASI**, inoltre tieni conto di eventuali richieste dall utente:** .`;

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
    console.log(result.response.text());

    return {
      statusCode: 200,
      body: {
        result: result
      },
    };
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, message: 'Errore durante il caricamento del file' });
  }
})
