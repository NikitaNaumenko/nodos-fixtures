import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export default @Entity() class User {
    @PrimaryGeneratedColumn()
    id = undefined

    @Column('varchar')
    firstName = '';

    @Column('text')
    lastName = '';

    @Column('int')
    age = undefined;
}
