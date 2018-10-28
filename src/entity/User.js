import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id = undefined

    @Column("varchar")
    firstName = "";

    @Column("text")
    lastName = "";

    @Column("int")
    age = undefined;

}
