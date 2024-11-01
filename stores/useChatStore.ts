import { defineStore } from 'pinia'
import type { File } from '@prisma/client';



// interface Chat {
//   id: number;
//   userId: number;
//   sessionId: string | null;
//   messages: Message[];
//   files: File[];
// }

interface Chat {
  id: number;
  userId: number;
  sessionId: string | null;
  messages: {
    text: string;
    user: string;
    date: string | Date;
  }[];
  files: {
    id: number;
    userId: number;
    chatId: number | null;
    fileName: string | null;
    fileUrl: string;
    status: string;
    createdAt: Date;
  }[];
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
  firstLoad: boolean;
  isUploading: boolean;
  leftAppBarShow: boolean;
  dbChat: Chat | null;
  fileSet: boolean;
}



export const useChatStore = defineStore({
  id: 'chatStore',
  state: (): ChatState => ({
    selectedFile: null,
    pdfUrl: '',
    promptUtente: '',
    messages: [],
    firstLoad: false,
    isUploading: false,
    leftAppBarShow: true,
    dbChat: null,
    fileSet: false
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

          this.firstLoad = true;

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

    async handleChange(file: File) {
      this.handleReset();
      this.selectedFile = file;
      this.pdfUrl = await fileUpload(file);

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

      this.firstLoad = true;
    },

    handleSendMessage(message: string) {
      this.promptUtente = message;
      if (this.pdfUrl) {
        this.sendMessage();
      } else {
        this.fileSet = true;
      }
    },

    handleReset() {
      this.promptUtente = '';
      this.messages = [];
      this.dbChat = null;
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
    isLoaded: (state) => state.firstLoad,
    currentMessages: (state) => state.messages,
    currentPdfUrl: (state) => state.pdfUrl
  }
})
