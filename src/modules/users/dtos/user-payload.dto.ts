import { User } from 'src/modules/users/user.entity';

export class UserPayloadDTO {
  user: User;
  token: string;
}
