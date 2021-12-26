/* eslint-disable max-len */
import React, {Fragment, useState} from 'react';
// import PropTypes from 'prop-types';
import {connect, useSelector} from 'react-redux';

// import 'bootstrap/dist/css/bootstrap.min.css';
import {
  selectFirstRequest,
  selectProcessing,
  selectRequestId,
} from '../features/link/linkSlice';
import LinkSocket from '../features/link/linkSocket';
import SearchHero from '../components/SearchHero';
import LinksTable from '../components/LinksTable';

import Rolling from '../assets/images/Rolling-primary.svg';
import RollingWhite from '../assets/images/Rolling-white.svg';
import Sumary from '../components/Sumary';

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
      <LinkSocket />
      <SearchHero />
      <div className="container mt-4 ">
        <h2 className="h1 my-3"><span className="text-primary">Translate</span> your website with GTELocalize.</h2>
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
                            <img src={Rolling} alt="crawling"/> <b>&ensp;Crawling... </b>
                          </div>
                        ) : (
                          <button className="btn btn-export btn-primary"
                            onClick={exportResult}
                          >
                            {exporting ? (
                              <img src={RollingWhite} alt="exporting" />
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

WordCount.propTypes = {
  // props: PropTypes
};

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(WordCount);
