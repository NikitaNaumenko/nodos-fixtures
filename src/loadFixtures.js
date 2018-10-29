import * as yaml from 'js-yaml';
import * as fs from 'fs';

export default async (name, dbConnection) => {
  try {
    const fixturesYaml = yaml.safeLoad(fs.readFileSync(`./test/fixtures/${name}.yml`, 'utf8'));
    fixturesYaml.fixtures.forEach(async (item) => {
      const entityName = Object.keys(item)[0];
      const entityData = item[entityName];
      await dbConnection
        .createQueryBuilder()
        .insert()
        .into(entityName.toLowerCase())
        .values(entityData)
        .execute();
    });
  } catch (e) {
    console.log('Fixtures dont loaded, error', e);
  }
};
