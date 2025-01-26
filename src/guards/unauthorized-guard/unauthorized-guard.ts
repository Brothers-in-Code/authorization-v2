import { Injectable } from '@nestjs/common';

import { BaseUserGuard } from 'src/guards/BaseUserGuard';

@Injectable()
export class UnauthorizedGuard extends BaseUserGuard {}
