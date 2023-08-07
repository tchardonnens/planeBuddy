import { signIn, signOut, useSession } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'

export default function Home() {

  const { data: session } = useSession()
  const userName = session?.user?.name

  if (session) {
    return (
      <main className="flex min-h-screen flex-col items-center p-12">
        <h1 className="text-4xl font-bold text-center text-neutral-800 mb-10">
          Hey {userName}! 👋
        </h1>
        <button className='bg-black text-white rounded-md w-64 p-2'>
          Find my mates!
        </button>
      </main>
    )
  }
  else {
    return (
      <>
        <main className="flex min-h-screen flex-col items-center p-12">
          <h1 className="text-4xl font-bold text-center text-neutral-800">
            Plane Buddy ✈️
          </h1>
          <p className='text-lg font-medium text-neutral-700 pt-4'>Find your BGA plane buddies 😊</p>
          <button onClick={() => signIn('google')} className='bg-white py-2.5 text-black rounded-md w-64 mt-4 hover:bg-lightGrey transition flex flex-row items-center justify-center gap-4 border-2'>
            <FcGoogle size={25} />
            Sign in with Google
          </button>
        </main>
      </>
    )
  }
}
