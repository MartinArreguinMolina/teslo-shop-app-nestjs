import { Injectable } from '@nestjs/common';
import { ProductService } from 'src/product/product.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor(
    private readonly productService: ProductService
  ){}

  async runSeed(){
    await this.insertNewProducts()

    return 'SEED EXECUTED';
  }

  private async insertNewProducts(){
    await this.productService.deleteAllProducts()

    const products = initialData.products;

    const insertPromises: any = [];

    products.forEach(products => {
      insertPromises.push(this.productService.create(products))
    })

    await Promise.all(insertPromises);
    
    return true;
  }
}
