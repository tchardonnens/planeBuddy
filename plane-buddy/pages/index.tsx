import FlightForm from '@/components/FlightForm';
import { PlaneMateCard } from '@/components/PlaneMateCard';
import UserForm from '@/components/UserForm';
import { signIn, signOut, useSession } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'
import useSWR from 'swr';

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
      <main className="flex min-h-screen flex-col items-center p-12">
        <h1 className="text-4xl font-bold text-center text-neutral-800 mb-4">
          Hey {userName}! 👋
        </h1>
        <UserForm userEmail={userEmail} onSubmit={handleFormSubmit} />
        <button onClick={() => signOut()} className='bg-white py-2.5 text-black rounded-md w-64 mt-4 hover:bg-lightGrey transition flex flex-row items-center justify-center gap-4 border-2'>
          <FcGoogle size={25} />
          Sign out
        </button>
      </main>
    )
  }

  else if (status === "authenticated" && hasFilledProfile(userData) && !hasFilledFlight(flightData)) {
    return (
      <main className="flex min-h-screen flex-col items-center p-10">
        <h1 className="text-4xl font-bold text-center text-neutral-800 mb-4">
          Hey {userName}! 👋
        </h1>
        <FlightForm onSubmit={handleFlightFormSubmit} />
        <button onClick={() => signOut()} className='bg-white py-2.5 text-black rounded-md w-64 mt-4 hover:bg-lightGrey transition flex flex-row items-center justify-center gap-4 border-2'>
          <FcGoogle size={25} />
          Sign out
        </button>
      </main>
    )
  }

  else if (status === "authenticated" && hasFilledFlight(flightData)) {
    return (
      <main className="flex min-h-screen flex-col items-center p-12">
        <h1 className="text-4xl font-bold text-center text-neutral-800 mb-4">
          Hey {userName}! 👋
        </h1>

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

        <button onClick={() => signOut()} className='bg-white py-2.5 text-black rounded-md w-64 mt-4 hover:bg-lightGrey transition flex flex-row items-center justify-center gap-4 border-2'>
          <FcGoogle size={25} />
          Sign out
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
