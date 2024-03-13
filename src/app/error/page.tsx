"use client"

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function ErrorPage() {

    const searchParams = useSearchParams()

    const router = useRouter()
 
    const search = searchParams.get('error')

    const errorDescription = () => {
        switch (search) {
            case 'unique':
                return 'One of the fields entered was already in use'
            case 'invusername':
                return 'Invalid username'
            case 'invpassword':
                return 'Invalid password'
            default:
                return 'An error occurred'
        }
    }

  return (
    <main className="flex w-full items-center justify-center h-screen overflow-hidden flex-col">
      <h1 className="text-5xl font-bold text-center">{errorDescription()}</h1>
      <p className="text-4xl text-center">Please try again</p>
      <button className="bg-blue-500 p-2 mt-3 rounded-md" onClick={() => router.back()}>Go back</button>
    </main>
  );
}
