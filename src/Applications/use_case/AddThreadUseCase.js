const AddThread = require('../../Domains/threads/entities/AddThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, owner, date) {
    const addThread = new AddThread(useCasePayload);
    return this._threadRepository.addThread(addThread, date, owner);
  }
}

module.exports = AddThreadUseCase;
