import React from 'react';
import './Navbar.css';
import navLogo from '/src/assets/nav-logo.svg';
const Navbar = () => {
  return (
    <div className='navbar'>
        <img src={navLogo} alt="" className="nav-logo" />
    </div>
  )
}

export default Navbar