import { Injectable } from '@nestjs/common';

import { BaseUserGuard } from 'src/guards/base-user-guard';

@Injectable()
export class UnauthorizedGuard extends BaseUserGuard {}
