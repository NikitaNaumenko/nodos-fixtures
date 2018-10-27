import yml from 'js-yaml';
import { promises as fs } from 'fs';

export default async () => {
  const rawData = await fs.readFile(`${__dirname}/fixtures.yml`);
  const fixtures = yml.safeLoad(rawData);
  console.log(fixtures);
};
