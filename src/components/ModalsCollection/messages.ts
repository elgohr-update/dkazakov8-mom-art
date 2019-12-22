import { wrapMessages } from 'utils/wrapMessages';

export const messages = wrapMessages(__dirname, {
  uploadImage_title: 'Загрузить изображение',
  auth_title: 'Войти',
  auth_email: 'Email',
  auth_password: 'Пароль',
  auth_submitButton: 'Войти',
  uploadImage_imageTitle: 'Заголовок [{lang}]',
  uploadImage_order: 'Порядок <= {totalItems}',
  uploadImage_removeButton: 'Удалить',
  uploadImage_saveButton: 'Сохранить',
  uploadImage_removeConfirm: 'Подтвердить удаление картины?',
  imageNotAttached: 'Прикрепите изображение',
});
