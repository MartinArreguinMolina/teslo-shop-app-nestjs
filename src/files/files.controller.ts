import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException, Param, Get, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helper';
import { diskStorage } from 'multer';
import { fileNamer } from './helpers/fileNamer.helper';
import { Response } from 'express';
import {ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,

    private readonly configService: ConfigService
  ) {}


  @Get('product/:imageName')
  findProductImage(
    // Res es necesario para mandar la imagen
    @Res() res: Response,
    @Param('imageName') imageName: string
  ){
    const path = this.filesService.getStaticProductIMage(imageName);

    // Regresar la imagen tal cual
    res.sendFile(path)
  }

  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    // Donde quiero almacenarlo
    storage: diskStorage({
      destination: './static/products',
      // lo voy a renombrar
      filename: fileNamer
    })
  }))
  // Tipado del archivo
  uploadProductImage(
    @UploadedFile()
    file: Express.Multer.File
  ){

    if(!file){
      throw new BadRequestException('Make sure that the file is an image')
    }

    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;

    return {
      secureUrl
    };
  }
}
