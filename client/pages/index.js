/* eslint-disable max-len */
import React, {Fragment, useState} from 'react';
// import PropTypes from 'prop-types';
import {connect, useSelector} from 'react-redux';

// import 'bootstrap/dist/css/bootstrap.min.css';
import {
  selectFirstRequest,
  selectProcessing,
  selectRequestId,
} from '../src/features/link/linkSlice';
import LinkSocket from '../src/features/link/linkSocket';
import SearchHero from '../src/components/SearchHero';
import LinksTable from '../src/components/LinksTable';

import Sumary from '../src/components/Sumary';
import Head from 'next/head';
import PageHead from '../src/components/PageHead';

export const WordCount = (props) => {
  const processing = useSelector(selectProcessing);
  const first = useSelector(selectFirstRequest);
  const requestId = useSelector(selectRequestId);

  const [exporting, setExporting] = useState(false);

  const exportResult = () => {
    setExporting(true);

    fetch(`/api/wordcount/export/${requestId}`)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'wordcount.xlsx';
        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();
        a.remove(); // afterwards we remove the element again
        setExporting(false);
      });
  };

  return (
    <Fragment>
      <PageHead />
      <LinkSocket />
      <SearchHero />
      <div className="container mt-4 ">
        <h2 className="h1 my-3">
          <span className="text-primary"></span> 
          Estimated word count on your website.</h2>
        <div className="row ">
          <div className="col-8 mb-5">
            <div className="card h-100">
              <div className="card-body">
                <div className="flex-2">
                  <h3 className="h2 mb-2">Words by page</h3>
                  <div>
                    {
                      first ? null : (
                        processing ? (
                          <div className="text-primary flex-vertical">
                            <img src="/images/Rolling-primary.svg" alt="crawling"/> <b>&ensp;Crawling... </b>
                          </div>
                        ) : (
                          <button className="btn btn-export btn-primary"
                            onClick={exportResult}
                          >
                            {exporting ? (
                              <img src="/images/Rolling-white.svg" alt="exporting" />
                            ) : (
                              <i className="fal fa-download"></i>
                            )}
                            &ensp;Export
                          </button>
                        )
                      )
                    }

                  </div>
                </div>
                <LinksTable />
              </div>
            </div>
          </div>
          <div className="col-4">
            <Sumary />
          </div>
        </div>

      </div>
    </Fragment>
  );
};


export default WordCount;
