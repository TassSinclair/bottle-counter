'use strict';

class RepositoryLogger {
  
  constructor(repository) {
    this.repository = repository;
  }

  put(event) {
    console.log(`storing ${JSON.stringify(event)}`);
    return this.repository.put(event);
  }

  getAll() {
    console.log('getting all');
    return this.repository.getAll();
  }
}

module.exports = RepositoryLogger;