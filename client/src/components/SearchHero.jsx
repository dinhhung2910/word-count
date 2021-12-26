/* eslint-disable max-len */
import React from 'react';
import GTELogo from '../assets/images/gte-logo.png';
import Dots1 from '../assets/images/dots (1).svg';
import Dots2 from '../assets/images/dots (2).svg';
import SearchInput from './SearchInput';

/**
 *
 * @return {*} 3
 */
function SearchHero() {
  return (
    <div
      style={{minHeight: '300px'}}
      className='bg-gradient-dark-blue w-100 pt-3'>
      <div className="container">
        <div className="w-100 text-center">
          <a href="https://gtelocalize.com/">
            <img src={GTELogo} alt="GTE Localize" style={{height: '50px'}} />
          </a>
          <div className="position-relative mt-5">
            <h1 style={{fontSize: '2rem'}} className="text-white">
              How many words do you have on your website?
            </h1>

            <SearchInput />

            <img src={Dots1} alt="decoration" style={{position: 'absolute', left: 0, bottom: '25px'}} />
            <img src={Dots2} alt="decoration" style={{position: 'absolute', right: 0, bottom: '25px'}} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchHero;
