import { QuestFormData } from '@/types/quest';
import { UseFormRegister, Control, FieldErrors } from 'react-hook-form';

export interface QuestFormProps {
  initialData?: QuestFormData;
  onSubmit: (data: QuestFormData) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export interface QuestFormFieldsProps {
  register: UseFormRegister<QuestFormData>;
  errors: FieldErrors<QuestFormData>;
  control: Control<QuestFormData>;
  isSubmitting?: boolean;
}