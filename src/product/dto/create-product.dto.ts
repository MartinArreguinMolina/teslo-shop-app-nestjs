import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, Min, MinLength } from "class-validator";

export class CreateProductDto {

    @ApiProperty({
        description: 'Product title (unique)',
        nullable: false,
        minLength: 1
    })
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    @IsPositive()
    price?: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    decription?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty()
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @ApiProperty()
    @IsString({
        // Cada uno de los elementos que vengan en el arreglo deben de cumplir la condicion de ser un string
        each: true
    })
    @IsArray()
    sizes: string[]

    @ApiProperty()
    @IsIn(['men','women','kid','unisex'])
    gender: string;

    @ApiProperty()
    @IsString({
        each: true
    })
    @IsArray()
    @IsOptional()
    tags: string[]

    @ApiProperty()
     @IsString({
        each: true
    })
    @IsArray()
    @IsOptional()
    images?: string[]



}
