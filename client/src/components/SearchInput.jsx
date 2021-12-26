/* eslint-disable max-len */
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import {abortRequest, createRequest, selectAborting, selectProcessing, selectRequestId} from '../features/link/linkSlice';
import Rolling from '../assets/images/Rolling-gray.svg';

/**
 *
 * @return {*} a
 */
function SearchInput() {
  const dispatch = useDispatch();
  const processing = useSelector(selectProcessing);
  const requestId = useSelector(selectRequestId);
  const aborting = useSelector(selectAborting);

  // const request = useSelector(selectRequest);

  const [formData, setFormData] = useState({
    home: 'https://gtelocalize.com',
    include: '',
    exclude: '',
  });

  const onChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const onSubmit = (e) => {
    if (processing) return;

    e.preventDefault();
    const parsedFromData = {
      home: formData.home,
      include: formData.include ? formData.include.replaceAll('; ', ';').split(';') : [],
      exclude: formData.exclude ? formData.exclude.replaceAll('; ', ';').split(';') : [],
    };
    dispatch(createRequest(parsedFromData));
  };

  const abortProcess = (e) => {
    e.preventDefault();
    if (aborting) return;

    dispatch(abortRequest(requestId));
  };


  return (
    <div className="row justify-content-center">
      <div className="col-md-10 text-center my-auto">
        <form name="form_word_count"
          onSubmit={onSubmit}>
          <div id="" className="word_count-form position-relative w-50 mx-auto mt-5 mb-5 word_count-url">
            <input type="text"
              name="home" required="required" label="" placeholder="Enter URL here.."
              inputMode="url"
              readOnly={processing}
              onChange={onChange}
              className="form-control form_word_count_url"
              value={formData.home} />
            {/* <div className="invalid-feedback">gygy</div> */}
            {!processing ? (
              <button className="btn btn-primary" type="submit" name="submit">
               Analyse website&ensp;
                <i className="fal fa-angle-right"></i>
              </button>
            ) : (
              <button className="btn-abort btn btn-secondary btn-icon"
                onClick={abortProcess}
                title='Abort'>
                {
                  aborting ?
                    (<img src={Rolling} alt="aborting" />) :
                    (<i className="fal fa-times"></i>)
                }

              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default SearchInput;
