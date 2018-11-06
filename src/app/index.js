import { createConnection } from 'typeorm';
import { resolve, basename, extname } from 'path';
import { safeLoad } from 'js-yaml';
import { promises } from 'fs';

const { readdir, readFile } = promises;

const drop = (connection, { entityName }) => connection
  .createQueryBuilder()
  .delete()
  .from(entityName)
  .where()
  .execute();


const load = async (connection, entityName, data) => {
  // eslint-disable-next-line
  for await (const value of data) {
    connection
      .createQueryBuilder()
      .insert()
      .into(entityName)
      .values(value)
      .execute();
  }
};

const convertLabels = yamlData => Object.entries(yamlData)
  .reduce((acc, [label, value]) => {
    console.log(label, value);
    const replacedObject = JSON.parse(JSON.stringify(value).replace('$LABEL', label));
    return [...acc, replacedObject];
  }, []);

const getPreparedData = async (pathToFixtures) => {
  const fixturesFiles = await readdir(pathToFixtures);
  const ymlFiles = fixturesFiles.filter(name => extname(name) === '.yml');
  return Promise.all(ymlFiles.map(async (fileName) => {
    const entityName = basename(fileName, '.yml');
    if (!entityName) {
      return;
    }

    const fileData = await readFile(resolve(pathToFixtures, fileName), 'utf8');
    const yamlData = convertLabels(safeLoad(fileData));

    return { entityName, seedData: Object.values(yamlData) };
  }));
};
export default async (config, pathToFixtures) => {
  let connection;
  try {
    connection = await createConnection(config);
    const preparedData = await getPreparedData(pathToFixtures);
    console.log(preparedData);
    await drop(connection, preparedData);
    // await preparedData(load);
  } catch (error) {
    console.error(error);
  } finally {
    if (connection) {
      connection.close();
    }
  }
};
