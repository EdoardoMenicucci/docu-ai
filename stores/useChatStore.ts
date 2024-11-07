import { defineStore } from 'pinia'
import type { File } from '@prisma/client';
import type { Chat } from '@prisma/client';



interface dbChat extends Chat {
  messages: Message[];
  files: File[];
}


interface Message {
  text: string;
  user: string;
  date: string | Date;
}




interface ChatState {
  selectedFile: File | null;
  pdfUrl: string;
  promptUtente: string;
  messages: Message[];
  isUploading: boolean;
  leftAppBarShow: boolean;
  dbChat: dbChat | null;
  fileSet: boolean;
  isSendingMessages: boolean
}



export const useChatStore = defineStore({
  id: 'chatStore',
  state: (): ChatState => ({
    selectedFile: null,
    pdfUrl: '',
    promptUtente: '',
    messages: [],
    isUploading: false,
    leftAppBarShow: true,
    dbChat: null,
    fileSet: false,
    isSendingMessages: false
  }),

  actions: {
    async fetchChat(id: number) {
      this.handleReset();
      try {
        const data = await $fetch(`/api/chat/${id}`);


        if (data.body && 'chat' in data.body && data.body.chat) {
          this.dbChat = data.body.chat;
          const messages = data.body.chat?.messages;

          if (this.dbChat?.files && this.dbChat.files.length > 0) {
            this.pdfUrl = this.dbChat.files[0].fileUrl;
          } else {
            this.pdfUrl = '';
          }


          console.log(messages);


          this.messages = messages?.map((message: any) => ({
            text: message.content,
            user: message.sender,
            date: timestampToDate(message.timestamp)
          })) || [];
        }
      } catch (error) {
        console.error('Errore durante il fetch della chat:', error);
      }
    },

    async handleChange(file: any) {
      this.handleReset();

      console.log(file);

      const formData = new FormData();
      formData.append('file', file);

      const uploadedFile = await $fetch('/api/file/upload', {
        method: 'POST',
        body: formData,
      });

      console.log(uploadedFile.body);

      if (!uploadedFile.body) {
        return;
      }
      this.pdfUrl = uploadedFile.body;

      try {
        const sessionId = startNewChatSession(this.messages);
        const formData = new FormData();

        formData.append('sessionId', sessionId as string);
        formData.append('fileUrl', this.pdfUrl);

        const data = await $fetch('/api/chat', {
          method: 'POST',
          body: formData,
        });

        if (data?.body?.chat) {
          this.dbChat = data.body.chat;
        }
      } catch (error) {
        console.error('Errore durante il fetch della chat:', error);
      }
    },

    handleSendMessage(message: string) {
      this.promptUtente = message;
      if (this.pdfUrl) {
        this.isSendingMessages = true
        this.sendMessage();
        this.isSendingMessages = false
      } else {
        this.fileSet = true;
      }
    },

    handleReset() {
      this.promptUtente = '';
      this.messages = [];
      this.dbChat = null;
      this.selectedFile = null;
      this.pdfUrl = '';
    },

    toggleLeftAppBar() {
      this.leftAppBarShow = !this.leftAppBarShow;
    },

    async sendMessage() {
      if (!this.dbChat?.id || !this.pdfUrl) {
        return;
      }

      try {
        const formData = new FormData();
        formData.append('chatId', this.dbChat.id);
        formData.append('prompt', this.promptUtente);

        this.messages = [
          ...this.messages,
          {
            text: this.promptUtente,
            user: 'USER',
            date: new Date()
          }
        ];

        const response = await fetch('/api/messages', {
          method: 'POST',
          body: formData
        });

        const res = await response.json();

        if (res.ok) {
          console.log('Messaggio inviato con successo');
        }

        const secondResponse = await $fetch(`/api/chat/${this.dbChat.id}`);

        if (secondResponse.body && 'chat' in secondResponse.body && secondResponse.body.chat) {

          if (secondResponse.body.chat.sessionId) {
            this.dbChat = secondResponse.body.chat;
          }

          const messages = secondResponse.body.chat.messages;

          this.messages = messages?.map((message: any) => ({
            text: message.content,
            user: message.sender,
            date: timestampToDate(message.timestamp)
          })) || [];
        }
      } catch (error) {
        console.error('Errore durante l\'invio del messaggio:', error);
      }
    }
  },

  getters: {
    isWaitingMessage: (state) => state.isSendingMessages,
    currentMessages: (state) => state.messages,
    currentPdfUrl: (state) => state.pdfUrl
  }
})
