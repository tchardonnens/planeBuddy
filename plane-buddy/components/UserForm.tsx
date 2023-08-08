import { useState } from 'react';

interface UserFormProps {
  userEmail: string;
  onSubmit: (data: any) => void;
}

const UserForm: React.FC<UserFormProps> = ({ userEmail, onSubmit }) => {
  const [data, setData] = useState({
    email: userEmail,
    username: '',
    instagramHandle: '',
    twitterHandle: '',
    messengerHandle: '',
    wechatHandle: '',
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
    <form onSubmit={handleSubmit} className='flex flex-col items-center px-6'>
      <label>
        Username:
      </label>
      <input type="text" className="bg-white rounded-md border-2 border-neutral-800 mb-4 px-2" name="username" value={data.username} onChange={handleChange} />
      <label>
        Instagram:
      </label>
      <input type="text" className="bg-white rounded-md border-2 border-pink-500 mb-4 px-2" name="instagramHandle" value={data.instagramHandle} onChange={handleChange} />
      <label>
        X (Twitter):
      </label>
      <input type="text" className="bg-white rounded-md border-2 border-blue-400 mb-4 px-2" name="twitterHandle" value={data.twitterHandle} onChange={handleChange} />
      <label>
        Messenger:
      </label>
      <input type="text" className="bg-white rounded-md border-2 border-violet-950 mb-4 px-2" name="messengerHandle" value={data.messengerHandle} onChange={handleChange} />
      <label>
        WeChat:
      </label>
      <input type="text" className="bg-white rounded-md border-2 border-green-500 mb-4 px-2" name="wechatHandle" value={data.wechatHandle} onChange={handleChange} />
      <button type="submit" className='bg-black text-white rounded-md w-64 p-2'>Save</button>
    </form>
  );
};

export default UserForm;
