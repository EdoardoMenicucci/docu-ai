import { findChatById } from "~/server/helpers/chatHelper";
import { getServerSession } from "#auth";

// Return chat by id

export default defineEventHandler(async (event) => {
    console.log('------GET CHAT ID------');

    try {
        const session = await getServerSession(event);
        console.log('session: ', session);

        if (!session || !session.user || !session.user.id) {
            throw new Error('User not authenticated');
        }

        const chatId = parseInt(event?.context?.params?.id || '');
        const chat = await findChatById(chatId);

        // console.log('chat: ', chat);


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
}
)