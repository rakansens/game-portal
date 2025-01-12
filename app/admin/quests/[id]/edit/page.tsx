import { Suspense } from 'react';
import { EditQuestForm } from './EditQuestForm';

interface EditQuestPageProps {
  params: {
    id: string;
  };
}

export default function EditQuestPage({ params }: EditQuestPageProps) {
  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-900">クエストの編集</h1>
        <p className="mt-1 text-sm text-gray-600">クエストの内容を編集します。</p>
      </div>

      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
          </div>
        }
      >
        <EditQuestForm id={params.id} />
      </Suspense>
    </div>
  );
}