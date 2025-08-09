// Tenemos que importar entity
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;


    @Column('text',{
        // No puede aver dos productos que tengan el mismo nombre
        unique: true
    })
    title2: string;

    @Column('numeric', {
        // Valor por defecto
        default: 0
    })
    price: number;

    @Column('text', {
        // Puede aceptar valores nulos
        nullable: true
    })
    description: string

    @Column('text', {
        // No puedo tener dos slug igulaes
        unique: true
    })
    slug: string;


    @Column('int', {
        default: 0
    })
    stock: number;

    @Column('text', {
        array: true
    })
    sizes: string[];

    @Column('text')
    gender: string
}
