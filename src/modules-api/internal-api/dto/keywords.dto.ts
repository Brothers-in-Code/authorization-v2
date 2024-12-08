import { IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PostWithKeywordsDTO {
  @IsNumber()
  id: number;

  @IsString({ each: true })
  keywords: string[];
}

export class PostWithKeywordsRequest {
  @ValidateNested({ each: true })
  @Type(() => PostWithKeywordsDTO)
  items: PostWithKeywordsDTO[];
}
