import { Connection, Repository } from 'typeorm';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import { User } from './entity/User';

export default async (name, dbConnection) => {
  let items;
  try {
    const fixturesYaml = yaml.safeLoad(fs.readFileSync(`./test/fixtures/${name}.yml`, 'utf8'));

    console.log(fixturesYaml);
    items = fixturesYaml.fixtures;
  } catch (e) {
    console.log('Fixtures dont loaded, error', e);
  }
  if (!items) {
    return;
  }
  items.forEach(async (item) => {
    const entityName = Object.keys(item)[0];
    const entityData = item[entityName];
    console.log(entityName);
    console.log(entityData);
    await dbConnection
      .createQueryBuilder()
      .insert()
      .into('user')
      .values(entityData)
      .execute();
  });
};
