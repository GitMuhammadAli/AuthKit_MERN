import React from 'react'
import { useAuth } from '../hooks/AuthContext'
function Home() {
  const { user, status } = useAuth();

  console.log(user, status);
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>No user information available.</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      {/* Add more fields as needed */}
    </div>
  );
}

export default Home