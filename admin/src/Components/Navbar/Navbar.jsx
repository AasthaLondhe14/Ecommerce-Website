import React from 'react';
import './Navbar.css';
import navLogo from '/src/assets/LOGOMAIN.png';

const Navbar = () => {
  return (
    <div className='navbar'>
      <img src={navLogo} alt="" className="nav-logo" />
      <span>ADMIN PANEL</span>
      <button onClick={() => window.location.href = 'http://localhost:3000'} className="nav-button">
        Go to Home
      </button>
    </div>
  );
}

export default Navbar;
