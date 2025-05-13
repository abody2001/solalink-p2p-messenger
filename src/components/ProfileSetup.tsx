import React, { useState } from 'react';
import { UserProfile } from '../types/message';

type Props = {
  publicKey: string;
  onComplete: () => void;
};

const ProfileSetup: React.FC<Props> = ({ publicKey, onComplete }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = () => {
    const profile: UserProfile = { username };
    localStorage.setItem('profile-${publicKey}', JSON.stringify(profile));
    onComplete();
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white p-6">
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
        <h1 className="text-xl font-bold text-gray-800">Set Up Your Profile</h1>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 rounded border border-gray-300"
        />
        <button
          onClick={handleSubmit}
          disabled={!username.trim()}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
        >
          Save and Continue
        </button>
      </div>
    </div>
  );
};

export default ProfileSetup;