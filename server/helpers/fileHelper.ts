import fs from 'fs/promises';
import path from 'path';
import os from 'os';

export const saveFile = async (fileData: any) => {
    const tempDir = os.tmpdir();
    const filePath = path.join(tempDir, fileData.filename ?? '');
    await fs.writeFile(filePath, fileData.data);
    return filePath;
};