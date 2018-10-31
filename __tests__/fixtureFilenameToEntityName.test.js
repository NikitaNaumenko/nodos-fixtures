import fixtureFilenameToEntityName from '../src/fixtureFilenameToEntityName';

test('transforms full path to entity name', () => {
  expect(fixtureFilenameToEntityName(`${__dirname}/user.yml`)).toBe('user');
});

test('transforms file name to entity name', () => {
  expect(fixtureFilenameToEntityName('/user.yml')).toBe('user');
});
