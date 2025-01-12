import { Suspense } from 'react';
import { EditQuestForm } from './EditQuestForm';
import { Metadata } from 'next';

interface EditQuestPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata(
  { params }: EditQuestPageProps
): Promise<Metadata> {
  return {
    title: 'クエストの編集',
  };
}

export default function EditQuestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">クエストの編集</h1>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
          </div>
        }
      >
        <EditQuestForm />
      </Suspense>
    </div>
  );
}