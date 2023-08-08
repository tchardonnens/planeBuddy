import { BsInstagram, BsWechat, BsMessenger, BsTwitter } from "react-icons/bs";

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

function openInstagram(username: string) {
  const appURL = `instagram://user?username=${username}`;
  const webURL = `https://www.instagram.com/${username}/`;

  const now = Date.now();
  setTimeout(() => {
    if (Date.now() - now < 1500) {
      window.location.href = webURL;
    }
  }, 50);
  window.location.href = appURL;
}

function openTwitter(username: string) {
  const appURL = `twitter://user?screen_name=${username}`;
  const webURL = `https://twitter.com/${username}/`;

  const now = Date.now();
  setTimeout(() => {
    if (Date.now() - now < 1500) {
      window.location.href = webURL;
    }
  }, 50);
  window.location.href = appURL;
}

async function copyToClipboard(value: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(value);
    alert("Copied the text: " + value);
  } catch (err) {
    alert("Error copying text: " + err);
  }
}

export const PlaneMateCard = ({ user }: { user: User }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <h3 className='text-2xl font-semibold'>{user.username}</h3>
      {user.instagramHandle &&
        <button onClick={() => openInstagram(user.instagramHandle || "")} className='bg-pink-600 flex flex-row gap-4 rounded-lg text-white p-2 items-center'>
          <BsInstagram size={20} />
          {user.instagramHandle}
        </button>
      }
      {user.twitterHandle &&
        <button onClick={() => openTwitter(user.twitterHandle || "")} className='bg-cyan-600 flex flex-row gap-4 rounded-lg text-white p-2 items-center'>
          <BsTwitter size={20} />
          {user.twitterHandle}
        </button>
      }
      {user.messengerHandle &&
        <button onClick={() => copyToClipboard(user.messengerHandle || "")} className='bg-blue-800 flex flex-row gap-4 rounded-lg text-white p-2 items-center'>
          <BsMessenger size={20} />
          {user.messengerHandle}
        </button>
      }
      {user.wechatHandle &&
        <button onClick={() => copyToClipboard(user.wechatHandle || "")} className='bg-green-500 flex flex-row gap-4 rounded-lg text-white p-2 items-center'>
          <BsWechat size={20} />
          {user.wechatHandle}
        </button>
      }
    </div>
  );
};