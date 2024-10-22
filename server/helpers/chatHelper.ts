import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const findOrCreateChat = async (userId: number, sessionId: string, promptUtente: string, resultText: string, fileData: any, filePath: string) => {
    let chat = await prisma.chat.findFirst({
        where: { userId: userId, sessionId: sessionId },
        include: {
            messages: true,
            files: true,
        },
    });

    if (!chat) {
        chat = await prisma.chat.create({
            data: {
                userId: userId,
                sessionId: sessionId,
                messages: {
                    create: [
                        {
                            content: promptUtente,
                            sender: 'USER',
                        },
                        {
                            content: resultText,
                            sender: 'AI',
                        },
                    ],
                },
                files: {
                    create: {
                        userId: userId,
                        fileName: fileData.filename,
                        fileUrl: filePath,
                        status: 'uploaded',
                    },
                },
            },
            include: {
                messages: true,
                files: true,
            },
        });
    } else {
        await prisma.message.createMany({
            data: [
                {
                    content: promptUtente,
                    sender: 'USER',
                    chatId: chat.id,
                },
                {
                    content: resultText,
                    sender: 'AI',
                    chatId: chat.id,
                },
            ],
        });
        // FILE CHECK
        let fileExist = await prisma.file.findFirst({
            where: { chatId: chat.id },
        });

        if (!fileExist) {
            await prisma.file.create({
                data: {
                    userId: userId,
                    chatId: chat.id,
                    fileName: fileData.filename,
                    fileUrl: filePath,
                    status: 'uploaded',
                },
            });
        }

    }

    return chat;
};