const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread.js');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('Should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'Justinus Andreas [Backend]',
      body: 'The story of Justinus Andreas as Backend Developer Expert',
    };

    const mockAddedThread = new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      body: useCasePayload.body,
      date: new Date().toISOString(),
      owner: 'user-123',
    });

    // Creating dependency of use case
    const mockThreadRepository = new ThreadRepository();

    // mocking needed function
    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));

    // Creating use case instance
    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await getThreadUseCase.execute(
      useCasePayload,
      mockAddedThread.owner,
      mockAddedThread.date
    );

    // Assert
    expect(addedThread).toStrictEqual(
      new AddedThread({
        id: mockAddedThread.id,
        title: useCasePayload.title,
        body: useCasePayload.body,
        date: mockAddedThread.date,
        owner: mockAddedThread.owner,
      })
    );

    expect(mockThreadRepository.addThread).toBeCalledWith(
      new AddThread(useCasePayload),
      mockAddedThread.date,
      mockAddedThread.owner
    );
  });
});
