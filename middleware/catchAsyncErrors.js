module.exports = (checkFunction) => (req, res, next) => {
  Promise.resolve(checkFunction(req, res, next)).catch(next);
};
