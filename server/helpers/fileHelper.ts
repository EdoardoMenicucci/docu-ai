import { PrismaClient } from '@prisma/client';

import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const prisma = new PrismaClient();

export const saveFile = async (fileData: any) => {
    const tempDir = os.tmpdir();
    const filePath = path.join(tempDir, fileData.filename ?? '');
    await fs.writeFile(filePath, fileData.data);
    return filePath;
};

//save the file to database

export const saveFileToDatabase = async (userId: number, chatId: number, fileData: any, filePath: string) => {
    await prisma.file.create({
        data: {
            userId: userId,
            chatId: chatId,
            fileName: fileData.filename,
            fileUrl: filePath,
            status: 'uploaded',
        },
    });
};