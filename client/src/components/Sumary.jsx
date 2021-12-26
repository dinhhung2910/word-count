/* eslint-disable max-len */
import React, {Fragment} from 'react';
import {useSelector} from 'react-redux';
import {selectFirstRequest, selectProcessing, selectRequest} from '../features/link/linkSlice';
import Rolling from '../assets/images/Rolling-primary.svg';


/**
 *
 * @return {Component} Sumary
 */
function Sumary() {
  const processing = useSelector(selectProcessing);
  const request = useSelector(selectRequest);
  const first = useSelector(selectFirstRequest);

  return (
    <div className="card">
      <div className="card-body">
        <div className="text-center">
          <h3
            className="text-center mt-4"
            style={{fontSize: '2rem'}}
          >
            {new Intl.NumberFormat('en-US').format(request.totalWord)}
          </h3>
          <span className="text-muted text-center lead">Total word count</span>
        </div>
        <div className="text-center mt-1">
          {/* This count is an estimate
          <i className="material-icons ic-info m-1" data-toggle="tooltip-html" data-placement="right" title="" data-template="&lt;div class=&#39;tooltip&#39; role=&#39;tooltip&#39;&gt;&lt;div class=&#39;arrow&#39;&gt;&lt;/div&gt;&lt;div class=&#39;tooltip-inner text-left&#39;&gt;&lt;/div&gt;&lt;/div&gt;" data-original-title="This wordcount tool gives you a static estimate of the total number of words on your website to get you started on a plan.
                          Please note that this tool is designed to give you only an estimation and that the real word count can be larger, especially if:&lt;br/&gt;&lt;br/&gt;
                             &lt;ul&gt;
                                  &lt;li&gt;You have pages that are private or unlinked in the website so our scan can&#39;t find it.&lt;/li&gt;
                                  &lt;li&gt;You make future modifications on existing pages.&lt;/li&gt;
                                  &lt;li&gt;You add pages on your website.&lt;/li&gt;
                             &lt;/ul&gt;"></i> */}
        </div>
        {
          first ? null : (
            <div className="row border-top mx-4 pt-2">
              <div className="col-1 p-0">
                {
                  processing ? (
                    <img src={Rolling} alt="processing"/>
                  ) : (
                    <i className="far fa-check text-primary" style={{fontSize: '1.25rem'}}></i>
                  )
                }
              </div>
              <div className="col-11 p-0 pl-2">
                <h3 className="animated fadeIn">Getting to all public URLs</h3>
              </div>
              {
                request.done ? (
                  <Fragment>
                    <div className="col-1 p-0">
                      <i
                        className={
                          request.status == 'Success' ? 'far fa-check text-primary' :
                            'far fa-times text-danger'
                        }
                        role="status"
                        style={{fontSize: '1.25rem'}}
                      ></i>
                    </div>
                    <div className="col-11 p-0 pl-2">
                      <h3 className="animated fadeIn">{request.status}</h3>
                    </div>
                  </Fragment>
                ) : null
              }
            </div>
          )
        }

      </div>
    </div>
  );
}

export default Sumary;
