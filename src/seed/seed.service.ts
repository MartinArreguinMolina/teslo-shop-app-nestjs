import { Injectable } from '@nestjs/common';
import { ProductService } from 'src/product/product.service';
import { initialData } from './data/seed-data';
import { QueryBuilder, Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SeedService {

  constructor(
    private readonly productService: ProductService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){}

  async runSeed(){
    await this.deleteTables()
    const adminUser = await this.insertUsers();

    await this.insertNewProducts(adminUser)

    return 'SEED EXECUTED';
  }

  private async deleteTables(){
    await this.productService.deleteAllProducts()

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
    .delete()
    .where({})
    .execute()
  }

  private async insertUsers() {
    const seedUsers = initialData.users;

    const users: User[] = [];

    seedUsers.forEach(user => {
      users.push(this.userRepository.create(user))
    })

    const dbUsers = await this.userRepository.save(seedUsers)

    return dbUsers[0];
  }

  private async insertNewProducts(user: User){
    await this.productService.deleteAllProducts()

    const products = initialData.products;

    const insertPromises: any = [];

    products.forEach(products => {
      insertPromises.push(this.productService.create(products, user))
    })

    await Promise.all(insertPromises);
    
    return true;
  }
}
