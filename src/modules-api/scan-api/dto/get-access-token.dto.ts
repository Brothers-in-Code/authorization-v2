import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class GetAccessTokenDto {
  @Type(() => Number)
  @IsNumber()
  user_id: number;
  @IsString()
  refresh_token: string;
  @IsString()
  device_id: string;
}
