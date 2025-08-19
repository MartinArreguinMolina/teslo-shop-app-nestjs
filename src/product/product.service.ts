import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, Query } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';
import { ProductImage } from './entities';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ProductService {


  // Esto es para realizar mensajes mas visibles en la consola
  private readonly logger = new Logger('ProductService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,


    @InjectRepository(ProductImage)
    private readonly productImageRepositoty: Repository<ProductImage>,

    // Para crear un QueryRunner
    private readonly dataSource : DataSource
  ) { }

  async create(createProductDto: CreateProductDto, user: User) {
    try {
      const {images = [], ...productDetails} = createProductDto;
      
      const product = this.productRepository.create({
        ...productDetails,
        // Crea la imagen 
        images: images.map(image => this.productImageRepositoty.create({url: image})),
        user: user
      });

      await this.productRepository.save(product);

      return {...product, images};
    } catch (error) {
      this.handleDbExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {

    const {limit = 10, offset = 0} = paginationDto;

    const products = await this.productRepository.find({
      // Toma 10 valores
      take: limit,
      // Saltate todos los que me diga el offeset
      skip: offset,

      relations: {
        images: true
      }
    })


    return products.map((product) => ({
      ...product,
      images: product.images?.map(img => img.url)
    }))
  }

  async findOne(term: string) {

    let produt: Product | null = null;

    if(isUUID(term)){
      produt = await this.productRepository.findOneBy({id: term})
    }else{
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      produt = await queryBuilder.where('UPPER(title)=:title or slug=:slug', {
        title: term.toUpperCase(),
        slug: term.toLocaleLowerCase()
      })
      // Extrae todos los datos de la relacion con la tabla imagenes, solo si se utiliza el queryBuilder
      .leftJoinAndSelect('prod.images', 'prodImages')
      .getOne();
      
      // produt = await this.productRepository.findOneBy({slug: term})
    }


    if(!produt)
      throw new NotFoundException(`product not found with term ${term}`)


    return produt;
  }

  async findOnePlain(term: string){
    const {images = [], ...rest} = await this.findOne(term);

    return {
      ...rest,
      images: images.map(img => img.url)
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto,  user: User) {
    const {images, ...toUpdate} = updateProductDto;

    const product = await this.productRepository.preload({id, ...toUpdate})

    if(!product) throw new NotFoundException(`Product with id: ${id} not found`);

    // Crearcion del queryRunner
    // Ejecuta x cantidad de querys y si todas salen bien impacta la base de datos, si no realizar rolback
    const queryRunner = this.dataSource.createQueryRunner();
    // conectar a la base de datos
    await queryRunner.connect();
    // Inicializar transaccion
    await queryRunner.startTransaction()

    try{
      if(images){
        // Eliminar imagenes que estaban adentro de la tabla imagenes del producto
        // Borra todas la imagenes cuya columna coincida con el id del producto
        await queryRunner.manager.delete(ProductImage, {product: {id}});

        product.images = images.map(image => 
          this.productImageRepositoty.create({url: image})
        )
      }else{
        
      }

      product.user = user;
      
      await queryRunner.manager.save(product);

      // Si hasta este punto no hay errores realiza los cambios
      await queryRunner.commitTransaction();
      // Elimina el query runner
      await queryRunner.release();



      // await this.productRepository.save(product);
      return this.findOnePlain(id);
    }catch(error){
      // si algo sale mal revierte todos los cambios
      await queryRunner.rollbackTransaction()
      await queryRunner.release()
      this.handleDbExceptions(error);
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);


    await this.productRepository.remove(product);
  }

  private handleDbExceptions(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Ayuda!')
  }


  async deleteAllProducts(){
    const query = this.productRepository.createQueryBuilder('product');
    try{
      return await query
      .delete()
      .where({})
      .execute()
    }catch(error){
      this.handleDbExceptions(error)
    }
  }
}