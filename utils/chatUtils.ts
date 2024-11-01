import { v4 as uuidv4 } from 'uuid';

export const startNewChatSession = (msg: Ref) => {
  msg.value = [];
  let sessionId = uuidv4();
  return sessionId
}

export const resetChat = (promptUtente: Ref, msg: Ref, dbChat: Ref) => {
  promptUtente.value = "";
  msg.value = [];
  dbChat.value = '';
}

export const fileUpload = async (file: File) => {

  const fileUrl = file
  const formData = new FormData();
  formData.append('file', fileUrl);

  try {
    const response = await fetch('/api/file', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Errore durante l'upload: ${errorText}`);
    }

    let res = await response.json();
    res.body.fileUrl = `${res.body.fileUrl}`
    console.log('File caricato con successo:', res);
    return res.body.fileUrl;

  } catch (error) {
    console.error('Errore durante l\'upload:', error);
  }
}

export const getCurrentTime = (): string => {
  const now = new Date();
  return now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
}

export const timestampToDate = (timestamp: Date) => {

  const data = new Date(timestamp);
  // Estrai l'orario in HH:MM
  const hours = data.getHours().toString().padStart(2, '0');
  const minutes = data.getMinutes().toString().padStart(2, '0');
  const formattedTime = `${hours}:${minutes}`;

  return formattedTime
}
