import * as yaml from 'js-yaml';
import * as fs from 'fs';
import getFixturesFiles from './getFixturesFiles';
import fixtureFilenameToEntityName from './fixtureFilenameToEntityName';

export default async (dbConnection) => {
  try {
    const fixturesFiles = getFixturesFiles();
    fixturesFiles.forEach((fixturePath) => {
      const fixturesYaml = yaml.safeLoad(fs.readFileSync(`./test/fixtures/${fixturePath}`, 'utf8'));
      const entityName = fixtureFilenameToEntityName(fixturePath);
      Object.keys(fixturesYaml).forEach(async (fixtureName) => {
        const entityData = fixturesYaml[fixtureName];
        await dbConnection
          .createQueryBuilder()
          .insert()
          .into(entityName)
          .values(entityData)
          .execute();
      });
    });
  } catch (e) {
    console.log('Fixtures dont loaded, error', e);
  }
};
