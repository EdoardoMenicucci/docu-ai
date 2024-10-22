import { v4 as uuidv4 } from 'uuid';

export const startNewChatSession = (sessionId: Ref, chat: Ref) => {
  sessionId.value = uuidv4();
  chat.value = [];
  console.log('Nuova sessione di chat iniziata con sessionId:', sessionId.value);
}

export const resetChat = (promptUtente: Ref, result: Ref, previousFileName: Ref, previousPrompt: Ref, chat: Ref) => {
  promptUtente.value = "";
  result.value = [];
  previousFileName.value = null;
  previousPrompt.value = null;
  chat.value = [];
}
