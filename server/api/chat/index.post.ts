import { PrismaClient } from '@prisma/client';
import { getServerSession } from '#auth'

const prisma = new PrismaClient();

// Return a new chat

export default defineEventHandler(async (event) => {
  // Create a new Chat
  console.log('---Create Chat---');
  const session = await getServerSession(event);

  try {

    let userId = session?.user.id;
    userId = parseInt(userId, 10);

    const formData = await readMultipartFormData(event);

    if (!formData) {
      throw createError({ statusCode: 400, message: 'No form data' });
    }


    let sessionId;
    let pdfUrl

    for (const data of formData) {
      if (data.name === 'sessionId') {
        sessionId = data.data.toString();
        console.log('sessionId:', sessionId);
      }
      if (data.name === 'fileUrl') {
        pdfUrl = data.data.toString();
        console.log('message:', pdfUrl);
      }
    }

    console.log('session Id :', sessionId, 'pdfUrl:', pdfUrl);


    if (!sessionId) {
      throw createError({ statusCode: 400, message: 'No sessionId' });
    }

    let chat = await prisma.chat.create({
      data: {
        userId: userId,
        sessionId: sessionId,
        files: {
          create: {
            userId: userId,
            fileName: 'document',
            fileUrl: pdfUrl,
            status: 'uploaded',
          },
        },
      },
    });

    return {
      statusCode: 200,
      body: {
        chat: chat,
      },
    };
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, message: 'Errore durante la creazione della chat' });
  }
})
