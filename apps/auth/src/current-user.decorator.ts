import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserDocument } from './users/models/user.schema';

const getCurrentUserByContext = (context: ExecutionContext): UserDocument => {
  console.log('getCurrentUserByContext');
  return context.switchToHttp().getRequest().user; // user gets added to the request-object by the LocalAuthGuard
};

export const CurrentUser = createParamDecorator((_data, context) =>
  getCurrentUserByContext(context),
);
