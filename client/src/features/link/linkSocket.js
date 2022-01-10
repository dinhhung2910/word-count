import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import io from 'socket.io-client';
import {doneRequest, selectRequestId, updateRequestState} from './linkSlice';

/**
 *
 * @return {*}
 */
function LinkSocket() {
  const dispatch = useDispatch();
  const requestId = useSelector(selectRequestId);
  const [socket, setSocket] = useState({});
  // const dispatch = useDispatch();

  // const request = useSelector(selectRequest);

  useEffect(() => {
    try {
      if (requestId) {
        socket.emit('create', requestId);
        socket.on(requestId, (data) => {
          // console.log(request);
          if (data.remain) {
            dispatch(updateRequestState(data));
          } else {
            dispatch(doneRequest(requestId));
          }
        });
      }
    } catch (e) {
      console.warn(e);
    }
    return () => {
      try {
        if (requestId) {
          socket.off(requestId);
          socket.emit('quit', requestId);
        }
      } catch (e) {
        console.warn(e);
      }
    };
  }, [requestId]);

  /* Watch socket to check when it is disconnected
   */
  useEffect(() => {
    try {
      socket.emit('create', requestId);
    } catch (e) {
      if (socket) console.warn(e);
    }
  }, [socket.id]);


  /* Init socket when mount element
   */
  useEffect(() => {
    const requestSocket = io(`${process.env.NEXT_PUBLIC_API_SERVER}/request`, {
      transports: ['polling'],
      path: '/socket.io',
    });
    setSocket(requestSocket);
    requestSocket.on('update', (e) => {
      console.log(e);
    });
    return () => {
      try {
        requestSocket.emit('quit', requestId);
      } catch (e) {
        console.warn('Can\'t leave...');
        console.error(e);
      }
    };
    // }, []);
  }, []);

  return null;
}

export default LinkSocket;
