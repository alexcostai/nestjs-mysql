import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'is_public';
export const PublicRoute = () => SetMetadata(IS_PUBLIC_KEY, true);
