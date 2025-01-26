import { Injectable } from '@nestjs/common';

@Injectable()
export class LandingService {
  getUserAvatarFromRequest(request: any) {
    if ('user' in request) {
      return request.user.avatar;
    } else {
      return null;
    }
  }
}
