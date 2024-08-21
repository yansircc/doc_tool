"use client";
import { useRouter } from 'next/navigation';
import { searchAll } from '@/actions/searchAll';
export default function HomePage() {
  const router = useRouter();
  const handleClick = async () => {
    const res = await searchAll()
    if (res?.length > 0) {
      router.push(`/docs/${res[0]?.id}`)
    } else {
      router.push('/docs_tool')
    }
  };
  return (
    <main className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-6xl font-bold mb-40">Welcome to the document tool</h1>
      <button onClick={handleClick} className="bg-black text-white font-bold py-2 px-4 rounded">Get Started</button>
    </main>
  );
}
