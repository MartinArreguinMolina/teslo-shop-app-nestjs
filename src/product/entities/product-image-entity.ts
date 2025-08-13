import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity({name: 'product_images'})
export class ProductImage{
    // ID de la image
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    url: string;

    // Muchas imagenes pueden pertenecer a un producto
    @ManyToOne(
        () => Product,
        (product) => product.images,
        {onDelete: 'CASCADE'}
    )
    product: Product
}