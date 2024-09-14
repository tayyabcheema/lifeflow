import React, { useState, useEffect } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user")) || {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+920000000000",
    };
    setUser(loggedInUser);
  }, []);

  return (
    <div>
      <h1>Profile</h1>
      {user && (
        <div>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phone}</p>
          {/* Add more user details as needed */}
        </div>
      )}
    </div>
  );
};

export default Profile;
