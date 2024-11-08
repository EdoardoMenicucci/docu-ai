import type { Message } from '../stores/useChatStore';

import { v4 as uuidv4 } from 'uuid';

export const startNewChatSession = (msg: Message[]) => {
  msg = [];
  let sessionId = uuidv4();
  return sessionId
}

export const resetChat = (promptUtente: Ref, msg: Ref, dbChat: Ref) => {
  promptUtente.value = "";
  msg.value = [];
  dbChat.value = '';
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

