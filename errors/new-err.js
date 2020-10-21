class newErr extends Error {
  constructor(message, errNum = 418) {
    super(message);
    this.statusCode = errNum;
  }
}

module.exports = newErr;
