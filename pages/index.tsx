import FlightForm from '@/components/FlightForm';
import { PlaneMateCard } from '@/components/PlaneMateCard';
import UserForm from '@/components/UserForm';
import { signIn, signOut, useSession } from 'next-auth/react'
import Head from 'next/head';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc'
import useSWR from 'swr';
import { TbLogout } from 'react-icons/tb'

export default function Home() {

  interface User {
    id: number;
    username: string;
    email: string;
    instagramHandle?: string | null;
    twitterHandle?: string | null;
    messengerHandle?: string | null;
    wechatHandle?: string | null;
    userFlights: UserFlight[];
  }

  interface Flight {
    id: number;
    flightNumber: string;
    departureTime: Date;
    departureAirport: string;
    arrivalTime: Date;
    arrivalAirport: string;
    userFlights: UserFlight[];
  }

  interface UserFlight {
    userId: number;
    flightId: number;
    user: User;
    flight: Flight;
  }

  const { data: session, status } = useSession()
  const userName = session?.user?.name || "unknown"
  const userEmail = session?.user?.email || "unknown"
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [isEditingFlight, setIsEditingFlight] = useState(false);

  const toggleEditUser = () => {
    setIsEditingUser(prevState => !prevState);
  }

  const toggleEditFlight = () => {
    setIsEditingFlight(prevState => !prevState);
  }


  const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error('Data fetch failed');
    }
    return res.json();
  };

  const { data: userData, error: userError } = useSWR(status === "authenticated" ? `/api/getUser?email=${userEmail}` : null, fetcher);

  const { data: flightData, error: flightError } = useSWR(status === "authenticated" && userData?.id ? `/api/getFlight?userId=${userData.id}` : null, fetcher);

  const { data: planeMates, error: planeMatesError } = useSWR(status === "authenticated" && flightData ? `/api/getPlaneMates?userId=${userData.id}` : null, fetcher);

  const hasFilledProfile = (user: User | null) => {
    return user && user.username &&
      (user.instagramHandle || user.twitterHandle || user.messengerHandle || user.wechatHandle);
  };

  const hasFilledFlight = (flight: Flight | null) => {
    return flight && flight.flightNumber
  };

  const handleFormSubmit = async (userData: any) => {
    try {
      const response = await fetch('/api/saveUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (data.success) {
        console.log("User data saved successfully!");
        setIsEditingFlight(false);

      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  const handleFlightFormSubmit = async (flightData: any) => {
    if (!userData || !userData.id) {
      console.error("User data is not available. Cannot save flight.");
      return;
    }

    const payload = {
      ...flightData,
      userId: userData.id,
    };


    try {
      const response = await fetch('/api/saveFlight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) {
        console.log("Flight data saved successfully!");
        setIsEditingUser(false);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error saving flight data:", error);
    }
  };

  if (status === "loading") {
    return <div className='flex min-h-screen flex-col items-center p-12'>Loading...</div>
  }

  if (status === "authenticated" && !hasFilledProfile(userData) && !hasFilledFlight(flightData)) {
    return (
      <>
        <header className="w-full flex flex-row justify-between p-4 bg-white shadow-md">
          <div className="flex flex-row items-center gap-4">
            <h1 className="text-2xl font-bold text-neutral-800">Plane Buddy ✈️</h1>
          </div>
          <button onClick={() => signOut()} className='bg-white text-black rounded-md flex flex-row items-center justify-center gap-1'>
            <TbLogout size={25} />
            Logout
          </button>
        </header>
        <main className="flex min-h-screen flex-col items-center p-12">
          <h1 className="text-4xl font-bold text-center text-neutral-800 mb-4">
            Hey {userName}! 👋
          </h1>
          <UserForm userEmail={userEmail} onSubmit={handleFormSubmit} defaultValues={null} />
        </main>
      </>
    )
  }

  else if (status === "authenticated" && hasFilledProfile(userData) && !hasFilledFlight(flightData)) {
    return (
      <>
        <header className="w-full flex flex-row justify-between p-4 bg-white shadow-md">
          <div className="flex flex-row items-center gap-4">
            <h1 className="text-2xl font-bold text-neutral-800">Plane Buddy ✈️</h1>
          </div>
          <button onClick={() => signOut()} className='bg-white text-black rounded-md flex flex-row items-center justify-center gap-1'>
            <TbLogout size={25} />
            Logout
          </button>
        </header>
        <main className="flex min-h-screen flex-col items-center p-10">
          <h1 className="text-4xl font-bold text-center text-neutral-800 mb-4">
            Hey {userName}! 👋
          </h1>
          <FlightForm onSubmit={handleFlightFormSubmit} />
        </main>
      </>
    )
  }

  else if (status === "authenticated" && hasFilledFlight(flightData)) {
    return (
      <>
        <header className="w-full flex flex-row justify-between p-4 bg-white shadow-md">
          <div className="flex flex-row items-center gap-4">
            <h1 className="text-2xl font-bold text-neutral-800">Plane Buddy ✈️</h1>
          </div>
          <button onClick={() => signOut()} className='bg-white text-black rounded-md flex flex-row items-center justify-center gap-1'>
            <TbLogout size={25} />
            Logout
          </button>
        </header>
        <main className="flex min-h-screen flex-col items-center p-12">

          <h1 className="text-4xl font-bold text-center text-neutral-800 mb-4">
            Hey {userName}! 👋
          </h1>
          <div className="flex gap-4 mb-8">
            <button onClick={toggleEditUser} className="bg-neutral-800 text-white rounded px-4 py-2">Edit User Info</button>
            <button onClick={toggleEditFlight} className="bg-neutral-800 text-white rounded px-4 py-2">Edit Flight Info</button>
          </div>
          {isEditingUser && <UserForm userEmail={userEmail} onSubmit={handleFormSubmit} defaultValues={userData} />}
          {isEditingFlight && <FlightForm onSubmit={handleFlightFormSubmit} defaultValues={flightData} />}


          {!isEditingUser && !isEditingFlight && (
            <div className='flex flex-col items-center gap-4'>
              <h2 className='text-md font-medium text-center text-neutral-800 mb-4'>Your plane mates for the flight <b>{flightData?.flightNumber}</b>:</h2>
              {planeMates && planeMates.length > 0 ? (
                <div className='flex flex-col gap-4 w-60'>
                  {planeMates.map((planeMate: User) => (
                    <PlaneMateCard key={planeMate.id} user={planeMate} />
                  ))}
                </div>
              ) : (
                <p className='text-md font-medium text-neutral-700'>No plane mates found 😢</p>
              )}
            </div>
          )}
        </main>
        <footer className='h-12 flex flex-row gap-1 justify-center'>
          Made with ❤️ by <a href='https://thomascdnns.com/' target='_blank' className='text-blue-500 hover:underline'>Thomas Chardonnens</a>, 2023
        </footer>
      </>
    )
  }

  else {
    return (
      <>
        <Head>
          <title>Plane Buddy</title>
          <meta name="description" content="Find your BGA plane buddies" />
          <link rel="icon" href="/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta property="og:title" content="Plane Buddy" />
          <meta property="og:description" content="Find your BGA plane buddies" />
          <meta property="og:image" content="/plane-buddy.png" />
          <meta property="og:url" content="https://plane-buddy.vercel.app/" />
        </Head>
        <div className="flex flex-col h-screen justify-between">
          <main className="flex flex-col items-center p-12">
            <h1 className="text-4xl font-bold text-center text-neutral-800">
              Plane Buddy ✈️
            </h1>
            <p className='text-lg font-medium text-neutral-700 pt-4'>Find your BGA plane buddies 😊</p>
            <p className='text-md font-medium text-neutral-700 px-5 py-4'>Here&apos;s a little website to find out if someone from the BGA program is on board in your plane!
              <br />
              <br />
              <ul>
                <li>1️⃣ Sign in with your Berkeley Google Account</li>
                <li>2️⃣ Fill out your profile</li>
                <li>3️⃣ Fill out your flight details</li>
                <li>🎉 See if anyone else is on the same flight as you!</li>
              </ul>
            </p>
            <button onClick={() => signIn('google')} className='bg-white py-2.5 text-black rounded-md w-64 mt-4 hover:bg-lightGrey transition flex flex-row items-center justify-center gap-4 border-2'>
              <FcGoogle size={25} />
              Sign in with Google
            </button>
          </main>
          <footer className='h-12 flex flex-row gap-1 justify-center'>
            Made with ❤️ by <a href='https://thomascdnns.com/' target='_blank' className='text-blue-500 hover:underline'>Thomas Chardonnens</a>, 2023
          </footer>

        </div>
      </>
    )
  }
}
