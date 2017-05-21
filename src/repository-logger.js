'use strict';

class RepositoryLogger {

  constructor(repository) {
    this.repository = repository;
  }

  put(event) {
    console.log(`storing ${JSON.stringify(event)}`);
    return this.repository.put(event);
  }

  getAll(type) {
    console.log('getting all', type);
    return this.repository.getAll(type);
  }

  getSince(type, since) {
    console.log('getting since', type, since);
    return this.repository.getSince(type, since);
  }
}

module.exports = RepositoryLogger;
