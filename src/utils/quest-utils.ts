import { Quest, QuestFormData, QuestStatus, VerificationType } from '../types/quest';

export function questToFormData(quest: Quest): QuestFormData {
  return {
    title: quest.title,
    description: quest.description,
    points: quest.points || 0,
    start_date: quest.start_date,
    end_date: quest.end_date,
    participants_limit: quest.participants_limit,
    required_points: quest.required_points || 0,
  };
}

export function formDataToQuest(formData: QuestFormData, id?: string): Partial<Quest> {
  return {
    ...(id && { id }),
    title: formData.title,
    description: formData.description,
    points: formData.points,
    start_date: formData.start_date,
    end_date: formData.end_date,
    participants_limit: formData.participants_limit,
    required_points: formData.required_points,
  };
}