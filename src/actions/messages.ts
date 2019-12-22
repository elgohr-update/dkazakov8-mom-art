import { wrapMessages } from 'utils/wrapMessages';

export const messages = wrapMessages(__dirname, {
  imageUploaded: 'Изображение загружено',
  galleryItemUpdated: 'Картина обновлена',
  imageDeleted: 'Изображение удалено',
  translationsSaved: 'Переводы сохранены',
  gapiIsBlocked: 'Google-авторизация заблокирована',
});
