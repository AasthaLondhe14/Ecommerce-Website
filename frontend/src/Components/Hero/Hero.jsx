import React, { useEffect, useRef } from 'react';
import './Hero.css';
import slide1 from '../Assets/banner_Men.jpg';
import slide2 from '../Assets/banner_Men.jpg';
import slide3 from '../Assets/banner_Men.jpg';

const Hero = () => {
  const sliderRef = useRef(null);
  let slideIndex = 0;

  useEffect(() => {
    const interval = setInterval(() => {
      if (sliderRef.current) {
        slideIndex = (slideIndex + 1) % 3; // Loop back to the first slide
        sliderRef.current.style.transform = `translateX(-${slideIndex * 100}%)`;
      }
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="hero">
      <div className="slider-container">
        <div className="slider" ref={sliderRef}>
          <div className="slide">
            <img src={slide1} alt="Slide 1" />
          </div>
          <div className="slide">
            <img src={slide2} alt="Slide 2" />
          </div>
          <div className="slide">
            <img src={slide3} alt="Slide 3" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
