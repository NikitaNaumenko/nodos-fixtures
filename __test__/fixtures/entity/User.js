import {
  OneToOne, JoinColumn, Entity, PrimaryGeneratedColumn, Column,
} from 'typeorm';
import Profile from './Profile';

export default @Entity() class User {
    @PrimaryGeneratedColumn()
    id

    @Column('varchar')
    firstName

    @Column('text')
    lastName

    @Column('int')
    age

    // eslint-disable-next-line
    @OneToOne(type => Profile, profile => profile.user) // specify inverse side as a second parameter
    @JoinColumn()
    profile
}
