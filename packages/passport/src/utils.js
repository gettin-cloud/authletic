function delegateTo(target, method) {
  return (...args) => (target[method](...args));
}

module.exports = {
  delegateTo,
};
