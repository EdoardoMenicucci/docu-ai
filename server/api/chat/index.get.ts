import { getServerSession } from '#auth'
import { findChat } from '../../helpers/chatHelper';

// Return all user's chat

export default defineEventHandler(async (event) => {
  console.log('------GET CHAT------');

  try {
    const session = await getServerSession(event);
    console.log('session: ', session);

    if (!session || !session.user || !session.user.id) {
      throw new Error('User not authenticated');
    }

    const userId = parseInt(session.user.id);
    const chat = await findChat(userId as number);

    return {
      statusCode: 200,
      body: {
        chat: chat,
      },
    };
  } catch (error) {
    console.error('Errore durante il fetch della chat:', error);
    return {
      statusCode: 500,
      body: {
        error: (error as Error).message,
      },
    };
  }
})
