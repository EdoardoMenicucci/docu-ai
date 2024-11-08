import { defineStore } from 'pinia'
import type { File } from '@prisma/client';
import type { Chat } from '@prisma/client';
import type { Sender } from '@prisma/client';
// import type { Message } from '@prisma/client';


interface dbChat {
  id: number;
  userId: number;
  createdAt: string;
  sessionId: string | null;
  messages: ChatMessage[];
  files: FileType[];
}

interface FileType {
  id: number;
  chatId: number | null;
  userId: number;
  createdAt: string;
  fileName: string | null;
  fileUrl: string;
  status: string;
}


interface Message {
  text: string;
  user: Sender;
  date: string;
}

interface ChatMessage {
  id: number;
  chatId: number;
  content: string;
  sender: Sender;
  timestamp: Date;
}


interface ChatState {
  selectedFile: FileType | null;
  pdfUrl: string;
  promptUtente: string;
  messages: Message[];
  isUploading: boolean;
  leftAppBarShow: boolean;
  dbChat: dbChat | null;
  fileSet: boolean;
  isSendingMessages: boolean
}

interface ApiResponse {
  ok: boolean;
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
          this.dbChat = {
            ...data.body.chat,
            messages: data.body.chat.messages.map((message: any) => ({
              ...message,
              timestamp: new Date(message.timestamp)
            }))
          };
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
          this.dbChat = data.body.chat as dbChat;
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
        formData.append('chatId', this.dbChat.id.toString());
        formData.append('prompt', this.promptUtente);

        this.messages = [
          ...this.messages,
          {
            text: this.promptUtente,
            user: 'USER',
            date: new Date().toLocaleString('it-IT', { hour: '2-digit', minute: '2-digit' })
          }
        ] as Message[];

        const response = await fetch('/api/messages', {
          method: 'POST',
          body: formData
        });

        const res: ApiResponse = await response.json();

        if (res.ok) {
          console.log('Messaggio inviato con successo');
        }

        const secondResponse = await $fetch(`/api/chat/${this.dbChat.id}`);

        if (secondResponse.body && 'chat' in secondResponse.body && secondResponse.body.chat) {

          if (secondResponse.body.chat.sessionId) {
            this.dbChat = {
              ...secondResponse.body.chat,
              messages: secondResponse.body.chat.messages.map((message: any) => ({
                ...message,
                timestamp: new Date(message.timestamp)
              }))
            };
          }

          const messages = secondResponse.body.chat.messages;

          this.messages = messages?.map((message: any) => ({
            text: message.content,
            user: message.sender,
            date: timestampToDate(message.timestamp)
          })) || [] as Message[];
        }
        this.isSendingMessages = false
      } catch (error) {
        console.error('Errore durante l\'invio del messaggio:', error);
        this.isSendingMessages = false
      }
    }
  },

  getters: {
    isWaitingMessage: (state) => state.isSendingMessages,
    currentMessages: (state) => state.messages,
    currentPdfUrl: (state) => state.pdfUrl
  }
})
