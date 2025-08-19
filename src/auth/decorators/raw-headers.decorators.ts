import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const RawHeaders = createParamDecorator(
    (data, ctx: ExecutionContext) => {
        const req = ctx.switchToHttp().getRequest()
        const rawHeaders = req.rawHeaders;

        // Error 500 es mio del backedn
        if(!rawHeaders)
            throw new InternalServerErrorException('user not found (requets)')

        return rawHeaders;
    }
)