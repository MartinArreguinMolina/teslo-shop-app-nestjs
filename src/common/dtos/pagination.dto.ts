import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";


export class PaginationDto{

    @ApiProperty({
        default: 10,
        description: 'How many rows do you need'
    })
    @IsOptional()
    @IsPositive()
    // Le dice a typescript que el dato va ha hacer transformado a el tipo number
    @Type(() => Number) // enableImiplicitConversations: true

    limit?: number;

    @ApiProperty({
        default: 0,
        description: 'How many rows do you want to skip'
    })
    @IsOptional()
    @Min(0)
    // Le dice a typescript que el dato va ha hacer transformado a el tipo number
    @Type(() => Number) // enableImiplicitConversations: true
    offset: number;
}