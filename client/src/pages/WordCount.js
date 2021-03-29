/* eslint-disable max-len */
import React, {Fragment, useState} from 'react';
// import PropTypes from 'prop-types';
import {connect, useDispatch, useSelector} from 'react-redux';
import {InputGroup, Button, FormControl} from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import {
  createRequest,
  selectProcessing,
  selectRequest,
} from '../features/link/linkSlice';
import LinkSocket from '../features/link/linkSocket';
import ProcessStatus from './ProcessStatus';


export const WordCount = (props) => {
  const dispatch = useDispatch();
  const processing = useSelector(selectProcessing);
  const request = useSelector(selectRequest);

  const [formData, setFormData] = useState({
    home: '',
    include: '',
    exclude: '',
  });
  const [showMore, setShowMore] = useState(false);

  const onChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const parsedFromData = {
      home: formData.home,
      include: formData.include ? formData.include.replaceAll('; ', ';').split(';') : [],
      exclude: formData.exclude ? formData.exclude.replaceAll('; ', ';').split(';') : [],
    };
    dispatch(createRequest(parsedFromData));
  };

  const clear = () => {
    setFormData({
      home: '',
      include: '',
      exclude: '',
    });
  };

  return (
    <Fragment>
      <LinkSocket />
      <div className="container">
        <div className="row mt-5">
          <div className="col-md-12">
            <form onSubmit={onSubmit}>
              <InputGroup>
                <FormControl
                  readOnly={processing}
                  placeholder="Homepage URL"
                  aria-describedby="basic-addon2"
                  name="home"
                  value={formData.home}
                  onChange={onChange}
                />
                <InputGroup.Append>
                  <Button variant="outline-warning"
                    onClick={clear}
                    disabled={processing}>
                    <i className="fal fa-trash-alt"></i>
                    {' '}
                    Clear
                  </Button>
                  <Button variant="outline-primary"
                    onClick={(e) => setShowMore(!showMore)}>
                    <i className="fal fa-sliders-h"></i>
                    {' '}
                    {showMore ? 'Show less' : 'Show more'}
                  </Button>
                  <Button type="submit"
                    disabled={processing}
                    variant="outline-success">
                    <i className="fal fa-play"></i>
                    {' '}
                    Start crawling
                  </Button>
                </InputGroup.Append>
              </InputGroup>
              {
                showMore ? (
                  <Fragment>
                    <InputGroup className="mt-2" title="Included pattern, seperated by semicolon">
                      <InputGroup.Prepend>
                        <InputGroup.Text>
                        Include
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <FormControl
                        name="include"
                        value={formData.include}
                        onChange={onChange}
                        aria-describedby="basic-addon3" />
                    </InputGroup>
                    <InputGroup className="mt-2" title='Excluded pattern, seperated by semicolon'>
                      <InputGroup.Prepend>
                        <InputGroup.Text>
                          Exclude
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <FormControl
                        name="exclude"
                        value={formData.exclude}
                        onChange={onChange}
                        aria-describedby="basic-addon3" />
                    </InputGroup>
                  </Fragment>
                ) : null
              }
            </form>
            <ProcessStatus />
            <InputGroup className="mt-4">
              <FormControl as="textarea"
                rows={10}
                value={request.links.
                  map((en) => `${en.link}\t${en.countWord}`).
                  join('\n')}
              />
            </InputGroup>
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
