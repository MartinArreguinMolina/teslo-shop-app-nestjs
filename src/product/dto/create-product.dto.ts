import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, Min, MinLength } from "class-validator";

export class CreateProductDto {

    @IsString()
    @MinLength(1)
    title: string;

    @IsNumber()
    @IsOptional()
    @IsPositive()
    price?: number;

    @IsString()
    @IsOptional()
    decription?: string;

    @IsString()
    @IsOptional()
    slug?: string;

    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @IsString({
        // Cada uno de los elementos que vengan en el arreglo deben de cumplir la condicion de ser un string
        each: true
    })
    @IsArray()
    sizes: string[]


    @IsIn(['men','women','kid','unisex'])
    gender: string;
}
