let _io = {};

/**
 * @param {*} io socket io instance
 */
function init(io) {
  _io = io;
  const nsp = io.of('/request');
  nsp.on('connection', function(socket) {
    socket.on('create', function(requestId) {
      try {
        socket.join(requestId);
      } catch (e) {
        console.error(e);
      }
    });

    socket.on('quit', function(requestId) {
      socket.leave(requestId);
    });
  });
}

/**
 *
 * @param {ObjectId} requestId
 * @param {*} data
 */
function sendUpdateToRequest(requestId, data) {
  // console.log(requestId, data);
  // _io.of('/request').to(requestId).emit('update', data);
  _io.of('/request').emit(requestId, data);
}

module.exports = {
  init,
  sendUpdateToRequest,
};
