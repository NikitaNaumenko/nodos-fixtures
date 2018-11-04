import { createConnection } from 'typeorm';
import { resolve, basename, extname } from 'path';
import { safeLoad } from 'js-yaml';
import { promises } from 'fs';

const { readdir, readFile } = promises;

const drop = (connection, entityName) => connection
  .createQueryBuilder()
  .delete()
  .from(entityName)
  .where()
  .execute();


const load = (connection, entityName, data) => Promise.all(
  data.map(value => connection
    .createQueryBuilder()
    .insert()
    .into(entityName)
    .values(value)
    .execute()),
);

const convertLabels = yamlData => Object.keys(yamlData).reduce((acc, label) => {
  const replacedObject = JSON.parse(JSON.stringify(yamlData[label]).replace('$LABEL', label));
  acc[label] = replacedObject;
  return acc;
}, {});

const getPreparedData = (dbConnection, pathToFixtures) => async (action) => {
  const fixturesFiles = await readdir(pathToFixtures);
  const ymlFiles = fixturesFiles.filter(name => extname(name) === '.yml');
  await Promise.all(ymlFiles.map(async (file) => {
    const fileData = await readFile(resolve(pathToFixtures, file), 'utf8');
    const yamlData = convertLabels(safeLoad(fileData));
    const entityName = basename(file, '.yml');

    return entityName && action(dbConnection, entityName, Object.values(yamlData));
  }));
};

export default async (config, pathToFixtures) => {
  let connection;
  try {
    connection = await createConnection(config);
    const preparedData = getPreparedData(connection, pathToFixtures);
    await preparedData(drop);
    await preparedData(load);
  } catch (error) {
    console.error(error);
  } finally {
    if (connection) {
      connection.close();
    }
  }
};
