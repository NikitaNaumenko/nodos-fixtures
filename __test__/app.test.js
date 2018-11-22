import path from 'path';
import { createConnection } from 'typeorm';
import app from '../src/app';
import User from './fixtures/entity/User';
import Simple from './fixtures/entity/Simple';
import Profile from './fixtures/entity/Profile';
import baseConfig from './fixtures/config.json';

const entities = {
  profile: Profile,
  user: User,
  simple: Simple,
};

const entitiesPath = [path.resolve(__dirname, 'fixtures', 'entity/*.js')];
const config = { ...baseConfig, entities: entitiesPath };

describe('App test', () => {
  let connection;

  afterEach(() => {
    connection.close();
  });

  it('Test app', async () => {
    await app(config, path.resolve(__dirname, 'fixtures'), entities);

    connection = await createConnection({ ...config, name: 'test' });
    const simpleData = await connection.getRepository(Simple).find();

    expect(simpleData).toHaveLength(2);
  });

  it('Test app with adding from fixtures2', async () => {
    await app(config, path.resolve(__dirname, 'fixtures2'), entities);

    connection = await createConnection({ ...config, name: 'test' });
    const users = await connection.getRepository(User).find();
    const profiles = await connection.getRepository(Profile).find();

    expect(users).toHaveLength(3);
    expect(profiles).toHaveLength(3);
  });
});
