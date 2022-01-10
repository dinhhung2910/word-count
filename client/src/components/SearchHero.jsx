/* eslint-disable max-len */
import React from 'react';

import SearchInput from './SearchInput';
import styles from '../../styles/SearchHero.module.css';

/**
 *
 * @return {*} 3
 */
function SearchHero() {
  return (
    <div
      style={{minHeight: '300px'}}
      className='bg-gradient-dark-blue w-100 pt-3'>
        <div className={styles['header-bg']}>
          <img src="/images/Banner - word count.jpg" className={styles['img-bg']} alt="Banner" />
        </div>
      <div className="container" style={{position: 'relative', zIndex: '1'}}>
        <div className="w-100 text-center">
          <a target="_blank" href="https://gtelocalize.com/">
            <img src="/images/gte-logo.png" alt="GTE Localize" style={{height: '50px'}} />
          </a>
          <div className="position-relative mt-5">
            <h1 style={{fontSize: '2rem'}} className="text-white">
              Free Website Word Count Tool
            </h1>
            <h2  style={{fontSize: '1.25rem'}} className="text-white">
              Counting words in your website.
            </h2>
            <SearchInput />

          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchHero;
