/* eslint-disable max-len */
import React, {Fragment} from 'react';
import {useResizeDetector} from 'react-resize-detector';
import {useSelector} from 'react-redux';
import dynamic from 'next/dynamic'

import {selectFirstRequest, selectProcessing, selectRequest} from '../features/link/linkSlice';

const Empty = dynamic(() => import('../assets/images/empty.svg'), {ssr: false});


/**
 * Links and its word count
 * @return {Component} LinksTable
 */
function LinksTable() {
  const {width, ref} = useResizeDetector();
  const request = useSelector(selectRequest);
  const processing = useSelector(selectProcessing);
  const first = useSelector(selectFirstRequest);

  return (
    <div
      className="table-wrapper-scroll-y my-custom-scrollbar"
      style={{height: !first ? '564px' : 'auto', overflow: 'auto', marginBottom: '-24px'}}
    >
      {
        first ? (
          <div className="instruction text-center">
            <Empty />
            <div className="instruction-text">
              Fill in URL and click Analyse website to start
            </div>
          </div>
        ) : (
          <table ref={ref} className="word-count-table table mt-2">
            <tbody>
              <Fragment>
                {request.links.map((en) => (
                  <tr className="animated fadeIn" key={en._id}>
                    <td style={{maxWidth: parseInt(width * 0.8) + 'px'}}>
                      {en.link}
                    </td>
                    <td className="font-weight-bold text-right">
                      {new Intl.NumberFormat('en-US').format(en.countWord)}
                    </td>
                  </tr>
                ))}
                {
                  processing ? (
                    new Array(Math.max(0, 7 - (request.links || []).length)).fill({}).map((en, index) => (
                      <tr className="dummy" key={index}>
                        <td></td>
                        <td></td>
                      </tr>
                    ))

                  ) : null
                }
              </Fragment>
            </tbody>
          </table>
        )
      }

    </div>
  );
}

export default LinksTable;
