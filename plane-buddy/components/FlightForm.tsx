// components/FlightForm.tsx

import { useState } from 'react';

interface FlightFormProps {
  onSubmit: (data: any) => void;
}

const FlightForm: React.FC<FlightFormProps> = ({ onSubmit }) => {
  const [data, setData] = useState({
    flightNumber: '',
    departureTime: '',
    departureAirport: '',
    arrivalTime: '',
    arrivalAirport: ''
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
    <form onSubmit={handleSubmit} className='flex flex-col items-center p-6'>
      <label>
        Flight Number
      </label>
      <input type="text" className="bg-white rounded-md border-2 border-neutral-800 mb-4 px-2" name="flightNumber" value={data.flightNumber} onChange={handleChange} />
      <label>
        Departure Time
      </label>
      <input type="datetime-local" className="mb-4" name="departureTime" value={data.departureTime} onChange={handleChange} />
      <label>
        Departure Airport
      </label>
      <input type="text" className="bg-white rounded-md border-2 border-neutral-800 mb-4 px-2" name="departureAirport" value={data.departureAirport} onChange={handleChange} />
      <label>
        Arrival Time
      </label>
      <input type="datetime-local" className="mb-4" name="arrivalTime" value={data.arrivalTime} onChange={handleChange} />
      <label>
        Arrival Airport
      </label>
      <input type="text" className="bg-white rounded-md border-2 border-neutral-800 mb-4 px-2" name="arrivalAirport" value={data.arrivalAirport} onChange={handleChange} />
      <button type="submit" className='bg-black text-white rounded-md w-64 p-2'>Submit</button>
    </form>
  );
};

export default FlightForm;
