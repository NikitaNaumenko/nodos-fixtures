import path from 'path';
import { createConnection } from 'typeorm';
import app from '../src/app';
import User from '../src/entity/User';
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
    const data = await connection.getRepository(User).find();

    expect(data).toHaveLength(2);
  });

  it('Test app with adding from fixtures2', async () => {
    await app(config, path.resolve(__dirname, 'fixtures2'));

    connection = await createConnection({ ...config, name: 'test' });
    const data = await connection.getRepository(User).find();

    expect(data).toHaveLength(3);
  });
});
