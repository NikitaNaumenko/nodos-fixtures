import * as fs from 'fs';

export default () => fs.readdirSync('./test/fixtures/').map(file => file);
