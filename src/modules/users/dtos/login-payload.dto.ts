import { User } from 'src/modules/users/user.entity';

export class LoginPayloadDTO {
  user: User;
  token: string;
}
