import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, ProductImage } from './entities';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [
    // Debemos de importar las entidades
    TypeOrmModule.forFeature([Product, ProductImage]),

    // Autenticaciones
    AuthModule
  ],

// Exporta todos los modulos con TypeOrmModule
  exports: [ProductService, TypeOrmModule]
})
export class ProductModule {}
