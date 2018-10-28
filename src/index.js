import { createConnection } from 'typeorm';
import loadFixtures from './loadFixtures';


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
  console.log(loadFixtures('users', connection));
}).catch(error => console.log(error));
