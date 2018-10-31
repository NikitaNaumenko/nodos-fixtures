import getFixturesFiles from '../src/getFixturesFiles';

test('returns fixtures files list', () => {
  expect(getFixturesFiles()).toEqual(['user.yml']);
});
