import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import tayyab from "../assets/tayyab.png"

const Settings = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Settings</h2>
      <div className="bg-white p-4 shadow rounded-lg">
        <div className="flex items-center mb-4">
          <Avatar alt="Profile Picture" src={tayyab} sx={{ width: 80, height: 80, marginRight: 2 }} />
          <Button variant="contained" color="primary">Change</Button>
        </div>
        <form>
          <div className="mb-4">
            <TextField
              fullWidth
              label="Full Name"
              variant="outlined"
              value="Tayyab"
              InputProps={{
                readOnly: true,
              }}
            />
          </div>
          <div className="mb-4">
            <TextField
              fullWidth
              label="Email Address"
              variant="outlined"
              value="tayyab@gmail.com"
              InputProps={{
                readOnly: true,
              }}
            />
          </div>
          <div className="mb-4">
            <TextField
              fullWidth
              label="Job Title"
              variant="outlined"
              value="Associate Software Engineer"
              InputProps={{
                readOnly: true,
              }}
            />
          </div>
          <div className="mb-4">
            <TextField
              fullWidth
              label="Company Name"
              variant="outlined"
              value="Lifeflow"
              InputProps={{
                readOnly: true,
              }}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
