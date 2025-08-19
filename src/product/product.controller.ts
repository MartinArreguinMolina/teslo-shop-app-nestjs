import { Auth } from 'src/auth/decorators/auth.decorator';
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { ApiResponse } from '@nestjs/swagger';
import { Product } from './entities';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}


  @Post()
  // Solo administradores pueden crear un producto
  @Auth()
  @ApiResponse({
    status: 201,
    description: 'Product was created',
    type: Product
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Token related'
  })
  create(
   @Body() createProductDto: CreateProductDto,
  //  Debemos de obtener el usuario para crear un nuevo producto
   @GetUser() user: User
  ) {
    return this.productService.create(createProductDto, user);
  }

  @Get()
  findAll(@Query()paginationDto: PaginationDto) {
    return this.productService.findAll(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.productService.findOnePlain(term);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    //  Debemos de obtener el usuario para crear un nuevo producto
   @GetUser() user: User
  ) {
    return this.productService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.remove(id);
  }
}
