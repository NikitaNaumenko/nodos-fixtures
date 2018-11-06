import path from 'path';
import { createConnection } from 'typeorm';
import app from '../src/app';
import User from '../src/entity/User';
// import Profile from '../src/entity/Profile';

import baseConfig from './fixtures/config.json';

const entities = [path.resolve(__dirname, '..', 'src/entity/*.js')];
const config = { ...baseConfig, entities };

describe('App test', () => {
  let connection;

  afterEach(() => {
    connection.close();
  });

  it('Test app', async () => {
    await app(config, path.resolve(__dirname, 'fixtures'));

    connection = await createConnection({ ...config, name: 'test' });
    const users = await connection.getRepository(User).find();
    // const profiles = await connection.getRepository(Profile).find();

    expect(users).toHaveLength(2);
    // expect(profiles).toHaveLength(2);
  });

  it('Test app with adding from fixtures2', async () => {
    await app(config, path.resolve(__dirname, 'fixtures2'));

    connection = await createConnection({ ...config, name: 'test' });
    const users = await connection.getRepository(User).find();
    // const profiles = await connection.getRepository(Profile).find();

    expect(users).toHaveLength(3);
    // expect(profiles).toHaveLength(2);
  });
});
