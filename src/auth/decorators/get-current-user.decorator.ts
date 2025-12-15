import { createParamDecorator } from "@nestjs/common";
import { ExecutionContext } from "@nestjs/common";

export const GetCurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user;
})