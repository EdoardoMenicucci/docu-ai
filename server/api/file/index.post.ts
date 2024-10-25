import { readMultipartFormData } from 'h3';
import { promises as fs } from 'fs';
import path from 'path';

//upload file to upload and return the file url

export default defineEventHandler(async (event) => {
  const uploadDir = path.resolve('./public/uploads');

  try {
    const formData = await readMultipartFormData(event);
    if (!formData) {
      throw createError({ statusCode: 400, message: 'No file uploaded' });
    }

    // Assicurati che la directory di upload esista
    await fs.mkdir(uploadDir, { recursive: true });

    let uploadedFile;
    let fileUrl;

    for (const data of formData) {
      if (data.name === 'file') {
        const filePath = path.join(uploadDir, data.filename as string);

        // Controlla se il file esiste già
        try {
          await fs.access(filePath);
          console.log('Il file esiste già:', filePath);
          fileUrl = `uploads/${data.filename}`; // URL del file esistente
        } catch (error) {
          if (error.code === 'ENOENT') {
            // Se il file non esiste, procedi con l'upload
            await fs.writeFile(filePath, data.data);
            uploadedFile = filePath;
            fileUrl = `uploads/${data.filename}`; // URL del nuovo file caricato
            console.log('File caricato con successo:', uploadedFile);
          } else {
            throw error; // Se c'è un altro errore, rilancialo
          }
        }
      }
    }

    if (!fileUrl) {
      throw createError({ statusCode: 400, message: 'No file found in form data' });
    }

    // Restituisci l'URL del file (sia esistente che nuovo)
    return {
      statusCode: 200,
      body: {
        fileUrl,
      },
    };
  } catch (error) {
    console.error('Errore durante l\'upload:', error);
    throw createError({ statusCode: 500, message: 'Errore durante l\'upload del file' });
  }
});

