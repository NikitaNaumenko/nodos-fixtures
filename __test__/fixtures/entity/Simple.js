import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export default @Entity() class Simple {
    @PrimaryGeneratedColumn()
    id

    @Column('varchar')
    name
}
