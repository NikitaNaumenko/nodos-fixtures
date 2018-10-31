import { createConnection } from 'typeorm';
import connectionConfig from './connectionConfig';
import loadFixtures from './loadFixtures';
import dropFixtures from './dropFixtures';

createConnection(connectionConfig).then((connection) => {
  dropFixtures(connection);
  loadFixtures(connection);
}).catch(error => console.log(error));
