/* eslint-disable max-len */
import React, {Fragment} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  abortRequest,
  selectProcessing,
  selectRequest,
  selectRequestId} from '../features/link/linkSlice';
import {Alert, ProgressBar} from 'react-bootstrap';
import {Button} from 'react-bootstrap';

/**
 *
 * @return {*}
 */
function ProcessStatus() {
  const processing = useSelector(selectProcessing);
  const request = useSelector(selectRequest);
  const requestId = useSelector(selectRequestId);
  const dispatch = useDispatch();

  const abortProcess = () => {
    dispatch(abortRequest(requestId));
  };

  return (
    <Fragment>
      {
        processing ? (
          <Fragment>
            <ProgressBar className="mt-4"
              animated
              label={`${request.crawled}/${request.total}`}
              now={request.crawled / request.total * 100} />
            <Button
              className="mt-1"
              style={{marginLeft: '50%', transform: 'translateX(-50%)'}}
              disabled={!processing}
              onClick={abortProcess}
              variant="outline-danger">
              <i className="fal fa-ban"></i>
              {' '}
                Abort
            </Button>
          </Fragment>
        ) : null
      }
      {
        request.done ? (
          <Fragment>
            <Alert variant='success' className="mt-4">
              <i className="fal fa-check-circle"></i>{' '}
              Crawled {request.total} pages, with total{' '}
              {(() => {
                let a = 0;
                a = request.links.reduce((acc, val) => acc + val.countWord, 0);
                return a;
              })()}
              {' '}words.
            </Alert>
          </Fragment>
        ) : null
      }
    </Fragment>
  );
}

export default ProcessStatus;
