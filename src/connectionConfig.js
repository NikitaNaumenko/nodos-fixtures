export default {
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
};
