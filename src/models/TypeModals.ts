export interface TypeModal {
  id: string;
  name: 'ModalAuth' | 'ModalUploadImage';
  isLeaving: boolean;
  isEntering: boolean;
  data?: Record<string, any>;
}

export type TypeModals = TypeModal[];
