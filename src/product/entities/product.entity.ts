// Tenemos que importar entity
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image-entity";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({name: 'products'})
export class Product {

    @ApiProperty({
        example: '0bf71a00-b5ad-4e32-b831-2ed2afa140e6',
        description: 'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'T-Shirt Teslo',
        description: 'Product Title',
        uniqueItems: true
    })
    @Column('text',{
        // No puede aver dos productos que tengan el mismo nombre
        unique: true
    })
    title: string;

    @ApiProperty({
        example: 0,
        description: 'Product price'
    })
    @Column('float', {
        // Valor por defecto
        default: 0
    })
    price: number;

    @ApiProperty({
        example: 'Lorem culpa et in qui. Id ipsum do do occaecat cillum ex esse ex anim est nulla occaecat dolor nulla. Et voluptate dolore duis deserunt mollit eiusmod aliqua minim cillum duis non. Tempor pariatur labore occaecat minim laborum. Et velit ipsum esse anim excepteur. Dolor eiusmod aliqua nostrud mollit tempor cupidatat eu. Labore incididunt reprehenderit aliqua ut.',
        description: 'Product description',
        default: null
    })
    @Column('text', {
        // Puede aceptar valores nulos
        nullable: true
    })
    description: string

    @ApiProperty({
        example: 't_shirt_teslo',
        description: 'Product SLUG - for SEO',
        uniqueItems: true
    })
    @Column('text', {
        // No puedo tener dos slug igulaes
        unique: true
    })
    slug: string;

    @ApiProperty({
        example: 10,
        description: 'Product stock',
        default: 0
    })
    @Column('int', {
        default: 0
    })
    stock: number;

    @ApiProperty({
        example: ['M','L','XL'],
        description: 'Product sizes',
    })
    @Column('text', {
        array: true
    })
    sizes: string[];

    @ApiProperty({
        example: 'women',
        description: 'Product gender '
    })
    @Column('text')
    gender: string

    @ApiProperty()
    @Column('text', {
        array: true,
        default: []
    })
    tags: string[]

    // Un producto tiene muchas imagenes
    @ApiProperty()
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        // La propiedad eager realiza todos los inner join correspondientes 
        {cascade: true, eager: true}
    )
    images?:ProductImage[];


    @ManyToOne(
        () => User,
        (user) => user.product,
        // Trae los datos de la relacion
        {eager: true}
    )
    user: User

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
