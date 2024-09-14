import React from 'react';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import OpacityIcon from '@mui/icons-material/Opacity'; // Importing a relevant icon for Blood Stock
import SettingsIcon from '@mui/icons-material/Settings';

const Sidebar = () => {
  return (
    <div className="w-64 bg-white border-r h-full">
      <nav className="p-4">
        <ul>
          <li className="mb-2">
            <Link to="/" className="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200">
              <HomeIcon className="mr-2" /> Home
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/donors" className="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200">
              <PeopleIcon className="mr-2" /> Donors
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/hospitals" className="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200">
              <LocalHospitalIcon className="mr-2" /> Hospitals
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/blood-stock" className="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200">
              <OpacityIcon className="mr-2" /> Blood Stock
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/settings" className="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200">
              <SettingsIcon className="mr-2" /> Settings
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
