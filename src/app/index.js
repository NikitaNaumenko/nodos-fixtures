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
    return acc;
  }, { simpleData: [], relatedData: { owner: [], slave: [] } });

const drop = connection => ({ entityName }) => connection
  .createQueryBuilder()
  .delete()
  .from(entityName)
  .where()
  .execute();

const loadSimple = connection => async ({ entityName, seedData }) => connection
  .createQueryBuilder()
  .insert()
  .into(entityName)
  .values(Object.values(seedData))
  .execute();

const loadRelated = async (connection, { owner, slave }) => {
  await Promise.all(owner.map(async (ownerEl) => {
    const ownerRepo = connection.getRepository(entities[ownerEl.entityName]);
    const [{ propertyName }] = ownerRepo.metadata.relations;
    const { seedData: slaveSeed } = slave.find(({ entityName }) => entityName === propertyName);
    const slaveDataToSave = Object.entries(slaveSeed).reduce((acc, [slaveKey, el]) => {
      const newVal = Object.entries(el)
        .reduce((slaveEntity, [key, val]) => {
        // eslint-disable-next-line
          slaveEntity[key] = val;
          return slaveEntity;
        }, new entities[propertyName]());
      return { ...acc, [slaveKey]: newVal };
    }, {});
    await Promise.all(Object.values(slaveDataToSave).map(el => connection.manager.save(el)));
    const ownerSeed = Object.values(ownerEl.seedData);
    const ownerDataToSave = ownerSeed.map(el => Object.entries(el)
      .reduce((acc, [key, val]) => {
        const newEl = (key === propertyName) ? slaveDataToSave[val] : val;
        acc[key] = newEl;
        return acc;
      }, new entities[ownerEl.entityName]()));

    await Promise.all(ownerDataToSave.map(el => connection.manager.save(el)));
  }));
};

const convertLabels = yamlData => Object.entries(yamlData)
  .reduce((acc, [label, value]) => {
    const replacedObject = JSON.parse(JSON.stringify(value).replace('$LABEL', label));
    return { ...acc, [label]: replacedObject };
  }, {});

const getPreparedData = async (pathToFixtures) => {
  const fixturesFiles = await readdir(pathToFixtures);
  const ymlFiles = fixturesFiles.filter(name => extname(name) === '.yml');
  return Promise.all(ymlFiles.map(async (fileName) => {
    const entityName = basename(fileName, '.yml');
    const fileData = await readFile(resolve(pathToFixtures, fileName), 'utf8');
    const yamlData = convertLabels(safeLoad(fileData));
    return { entityName, seedData: yamlData };
  }));
};

export default async (config, pathToFixtures) => {
  let connection;
  try {
    connection = await createConnection(config);
    const preparedData = await getPreparedData(pathToFixtures);
    console.log(preparedData);
    const { simpleData, relatedData } = sortData(connection, preparedData);

    await Promise.all(simpleData.map(drop(connection)));
    await Promise.all(relatedData.owner.map(drop(connection)));
    await Promise.all(relatedData.slave.map(drop(connection)));

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
