import { useState } from 'react';

interface UserFormProps {
  userEmail: string;
  onSubmit: (data: any) => void;
  defaultValues: any;
}

const UserForm: React.FC<UserFormProps> = ({ userEmail, onSubmit, defaultValues }) => {
  const [data, setData] = useState({
    email: userEmail,
    username: defaultValues?.username || '',
    instagramHandle: defaultValues?.instagramHandle || '',
    twitterHandle: defaultValues?.twitterHandle || '',
    messengerHandle: defaultValues?.messengerHandle || '',
    wechatHandle: defaultValues?.wechatHandle || '',
  });

  const handleChange = (e: any) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSubmit(data);
  };

  return (
    <>
      <p className='mb-4 text-center'>Only the username is mandatory! Chose to put the social networks you want so people can contact you!</p>
      <form onSubmit={handleSubmit} className='flex flex-col items-center px-6'>
        <label>
          Username:
        </label>
        <input type="text" className="bg-white rounded-md border-2 border-neutral-800 mb-4 px-2" name="username" placeholder="Bob Smith" value={data.username} onChange={handleChange} required />
        <label>
          Instagram:
        </label>
        <input type="text" className="bg-white rounded-md border-2 border-pink-500 mb-4 px-2" name="instagramHandle" placeholder="mynameisbob" value={data.instagramHandle} onChange={handleChange} />
        <label>
          X (Twitter):
        </label>
        <input type="text" className="bg-white rounded-md border-2 border-blue-400 mb-4 px-2" name="twitterHandle" placeholder="DarkBob" value={data.twitterHandle} onChange={handleChange} />
        <label>
          Messenger:
        </label>
        <input type="text" className="bg-white rounded-md border-2 border-violet-950 mb-4 px-2" name="messengerHandle" placeholder="bob smith" value={data.messengerHandle} onChange={handleChange} />
        <label>
          WeChatID:
        </label>
        <input type="text" className="bg-white rounded-md border-2 border-green-500 mb-4 px-2" name="wechatHandle" placeholder="WeChatID" value={data.wechatHandle} onChange={handleChange} />
        <button type="submit" className='bg-black text-white rounded-md w-64 p-2'>Save</button>
      </form>
    </>
  );
};

export default UserForm;
