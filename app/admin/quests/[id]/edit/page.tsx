'use client';

import { EditQuestForm } from './EditQuestForm';

interface EditQuestPageProps {
  params: {
    id: string;
  };
}

export default function EditQuestPage({ params }: EditQuestPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">クエストの編集</h1>
      <EditQuestForm questId={params.id} />
    </div>
  );
}