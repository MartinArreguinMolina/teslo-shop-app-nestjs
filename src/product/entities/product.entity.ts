// Tenemos que importar entity
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image-entity";

@Entity({name: 'products'})
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;


    @Column('text',{
        // No puede aver dos productos que tengan el mismo nombre
        unique: true
    })
    title: string;

    @Column('float', {
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


    @Column('text', {
        array: true,
        default: []
    })
    tags: string[]

    // Un producto tiene muchas imagenes
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        // La propiedad eager realiza todos los inner join correspondientes 
        {cascade: true, eager: true}
    )
    images?:ProductImage[];

    // Antes de insertar realiza lo siguiente
    @BeforeInsert()
    checkSlugInsert(){
        if(!this.slug){
            this.slug = this.title;
        }

        this.slug = this.slug.toLowerCase().replaceAll(' ', '_').replaceAll("'", '')
    }


    // Antes de modificar realiza lo siguiente
    @BeforeUpdate()
    checkSlugUpdate(){
        this.slug = this.slug.toLowerCase().replaceAll(' ', '_').replaceAll("'", '')
    }
}
