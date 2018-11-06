import {
  Entity, PrimaryGeneratedColumn, Column, OneToOne,
} from 'typeorm';
import User from './User';

export default @Entity() class Profile {
    @PrimaryGeneratedColumn()
    id = undefined

    @Column('varchar')
    name = '';

    // eslint-disable-next-line
    @OneToOne(type => User, user => user.profile)
    user = '';
}
