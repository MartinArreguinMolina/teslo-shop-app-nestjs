import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";


export class PaginationDto{

    @IsOptional()
    @IsPositive()
    // Le dice a typescript que el dato va ha hacer transformado a el tipo number
    @Type(() => Number) // enableImiplicitConversations: true

    limit?: number;


    @IsOptional()
    @Min(0)
    // Le dice a typescript que el dato va ha hacer transformado a el tipo number
    @Type(() => Number) // enableImiplicitConversations: true
    offset: number;
}