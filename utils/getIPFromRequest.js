const GetIPFromRequest = (req) => {
  const ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() ||
         req.connection.remoteAddress ||
         req.socket.remoteAddress ||
         req.connection.socket.remoteAddress;
  return ip;
};

module.exports = GetIPFromRequest;
