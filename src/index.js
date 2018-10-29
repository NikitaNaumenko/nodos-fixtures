import { createConnection } from 'typeorm';
import loadFixtures from './loadFixtures';
import dropFixtures from './dropFixtures';


createConnection({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'admin',
  password: 'admin',
  database: 'nodos_fixtures',
  synchronize: true,
  entities: [
    './entity/**/*.js',
  ],

}).then((connection) => {
  dropFixtures(connection);
  loadFixtures(connection);
}).catch(error => console.log(error));
