import { ModalAuth } from './ModalAuth';
import { ModalUploadImage } from './ModalUploadImage';
import { messages } from './messages';

export const ModalsCollection = {
  ModalUploadImage: {
    name: 'ModalUploadImage',
    title: messages.uploadImage_title,
    ContentComponent: ModalUploadImage,
  },
  ModalAuth: {
    name: 'ModalAuth',
    title: messages.auth_title,
    ContentComponent: ModalAuth,
  },
};
