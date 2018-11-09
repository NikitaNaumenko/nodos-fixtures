import { createConnection } from 'typeorm';
import { resolve, basename, extname } from 'path';
import { safeLoad } from 'js-yaml';
import { promises } from 'fs';
import entities from '../entity';

const { readdir, readFile } = promises;

const sortData = (connection, arr) => arr
  .reduce((acc, value) => {
    const { metadata } = connection.getRepository(entities[value.entityName]);
    const [relations] = metadata.relations;
    if (!relations) {
      acc.simpleData.push(value);
      return acc;
    }
    const role = relations.isWithJoinColumn ? 'owner' : 'slave';
    acc.relatedData[role].push(value);
    // console.log(Object.keys(relations));
    // console.log(relations.propertyName);
    // console.log(relations.isOneToOneOwner);
    // console.log(relations.isWithJoinColumn);
    return acc;
  }, { simpleData: [], relatedData: { owner: [], slave: [] } });


const drop = connection => ({ entityName }) => connection
  .createQueryBuilder()
  .delete()
  .from(entityName)
  .where()
  .execute();

const loadSimple = connection => async ({ entityName, seedData }) => {
  await connection
    .createQueryBuilder()
    .insert()
    .into(entityName)
    .values(seedData)
    .execute();
  console.log('data is saved');
};

const loadRelated = async (connection, { owner, slave }) => {
  await Promise.all(owner.map(async (ownerEl) => {
    const ownerRepo = connection.getRepository(entities[ownerEl.entityName]);
    const [relations] = ownerRepo.metadata.relations;
    const { propertyName } = relations;
    const { seedData: slaveSeed } = slave.find(({ entityName }) => entityName === propertyName);
    const slaveDataToSave = slaveSeed.map(el => Object.entries(el)
      .reduce((acc, [key, val]) => {
        acc[key] = val;
        return acc;
      }, new entities[propertyName]()));
    await Promise.all(slaveDataToSave.map(el => connection.manager.save(el)));
    const ownerDataToSave = ownerEl.seedData.map((el, index) => Object.entries(el)
      .reduce((acc, [key, val]) => {
        if (key === propertyName) {
          acc[key] = slaveDataToSave[index];
          return acc;
        }
        acc[key] = val;
        return acc;
      }, new entities[ownerEl.entityName]()));

    await Promise.all(ownerDataToSave.map(el => connection.manager.save(el)));
  }));
};

const convertLabels = yamlData => Object.entries(yamlData)
  .reduce((acc, [label, value]) => {
    // console.log(label, value);
    const replacedObject = JSON.parse(JSON.stringify(value).replace('$LABEL', label));
    return [...acc, replacedObject];
  }, []);

const getPreparedData = async (pathToFixtures) => {
  const fixturesFiles = await readdir(pathToFixtures);
  const ymlFiles = fixturesFiles.filter(name => extname(name) === '.yml');
  return Promise.all(ymlFiles.map(async (fileName) => {
    const entityName = basename(fileName, '.yml');
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
    await Promise.all(preparedData.map(drop(connection)));
    const { simpleData, relatedData } = sortData(connection, preparedData);
    // console.log(relatedData);
    await Promise.all(simpleData.map(loadSimple(connection)));
    await loadRelated(connection, relatedData);
  } catch (error) {
    console.error(error);
  } finally {
    if (connection) {
      connection.close();
    }
  }
};
