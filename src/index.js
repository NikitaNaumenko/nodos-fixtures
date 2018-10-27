import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { promises as fs } from 'fs';
import loadFixtures from './loadFixtures';

console.log(loadFixtures());
