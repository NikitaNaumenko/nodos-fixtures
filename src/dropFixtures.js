import getFixturesFiles from './getFixturesFiles';
import fixtureFilenameToEntityName from './fixtureFilenameToEntityName';

export default async (dbConnection) => {
  const fixturesFiles = getFixturesFiles();
  fixturesFiles.forEach(async (fixturePath) => {
    const entityName = fixtureFilenameToEntityName(fixturePath);
    await dbConnection
      .createQueryBuilder()
      .delete()
      .from(entityName)
      .where()
      .execute();
  });
};
