function promisify(fn) {
    /**
     * @param {...Any} params The params to pass into *fn*
     * @return {Promise<Any|Any[]>}
     */
    return function promisified(...params) {
      return new Promise((resolve, reject) => fn(...params.concat([(err, ...args) => err ? reject(err) : resolve( args.length < 2 ? args[0] : args )])))
    }
  }

  module.exports = promisify;