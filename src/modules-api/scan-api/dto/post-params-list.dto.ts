import { Type } from 'class-transformer';
import {
  IsInt,
  IsBoolean,
  IsString,
  ValidateNested,
  IsArray,
  IsNotEmpty,
  IsObject,
} from 'class-validator';

export class PostParamsListDto {
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  groupVKId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PostParamsDto)
  postParamsList: PostParamsDto[];
}

class PostParamsDto {
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  post_vkid: number;

  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  likes: number;

  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  views: number;

  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  comments: number;

  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  timestamp_post: number;

  @IsObject()
  @IsNotEmpty()
  json: object;

  //   NOTE пока не валидирую - сомневаюсь, что будет правильно работать
  //   @Type(() => PostType)
  //   json: PostType;
}

class DonutType {
  @IsBoolean()
  is_donut: boolean;
}

class CommentsType {
  @Type(() => Number)
  @IsInt()
  can_post: number;

  @Type(() => Number)
  @IsInt()
  can_view: number;

  @Type(() => Number)
  @IsInt()
  count: number;

  @Type(() => Number)
  @IsInt()
  groups_can_post: number;
}

class SizeType {
  @Type(() => Number)
  @IsInt()
  height: number;

  @IsString()
  type: string;

  @IsString()
  url: string;

  @Type(() => Number)
  @IsInt()
  width: number;
}

class PhotoType {
  @Type(() => Number)
  @IsInt()
  album_id: number;

  @Type(() => Number)
  @IsInt()
  date: number;

  @Type(() => Number)
  @IsInt()
  id: number;

  @Type(() => Number)
  @IsInt()
  owner_id: number;

  @IsString()
  access_key: string;

  @IsArray()
  @ValidateNested({ each: true })
  sizes: SizeType[];

  @IsString()
  text: string;

  @Type(() => Number)
  @IsInt()
  user_id: number;

  @IsString()
  web_view_token: string;

  @IsBoolean()
  has_tags: boolean;
  orig_photo: SizeType;
}

class AttachmentType {
  @IsString()
  type: string;

  @ValidateNested()
  @Type(() => PhotoType)
  photo: PhotoType;
}

class LikesType {
  @Type(() => Number)
  @IsInt()
  count: number;

  @Type(() => Number)
  @IsInt()
  user_likes: number;

  @Type(() => Number)
  @IsInt()
  can_like: number;

  @Type(() => Number)
  @IsInt()
  can_publish: number;

  repost_disabled: boolean;
}

class ReactionsType {
  @Type(() => Number)
  @IsInt()
  count: number;

  @Type(() => Number)
  @IsInt()
  user_reaction: number;

  @ValidateNested({ each: true })
  @IsArray()
  items: ItemType[];
}

class ItemType {
  @Type(() => Number)
  @IsInt()
  id: number;
  @Type(() => Number)
  @IsInt()
  count: number;
}

class PostSourceType {
  @IsString()
  type: string;
}

class RepostsType {
  @Type(() => Number)
  @IsInt()
  count: number;

  @Type(() => Number)
  @IsInt()
  user_reposted: number;
}

class ViewsType {
  @Type(() => Number)
  @IsInt()
  count: number;
}

class PostType {
  @IsString()
  inner_type: string;

  @ValidateNested()
  @Type(() => DonutType)
  donut: DonutType;

  @ValidateNested()
  @Type(() => CommentsType)
  comments: CommentsType;

  @IsInt()
  marked_as_ads: number;

  @IsString()
  hash: string;

  @IsString()
  type: string;

  @IsInt()
  carousel_offset: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentType)
  attachments: AttachmentType[];

  @IsInt()
  date: number;

  @IsInt()
  from_id: number;

  @IsInt()
  id: number;

  @IsBoolean()
  is_favorite: boolean;

  @ValidateNested()
  @Type(() => LikesType)
  likes: LikesType;

  @IsString()
  reaction_set_id: string;

  @ValidateNested()
  @Type(() => ReactionsType)
  reactions: ReactionsType;

  @IsInt()
  owner_id: number;

  @ValidateNested()
  @Type(() => PostSourceType)
  post_source: PostSourceType;

  @IsString()
  post_type: string;

  @ValidateNested()
  @Type(() => RepostsType)
  reposts: RepostsType;

  @IsInt()
  signer_id: number;

  @IsString()
  text: string;

  @ValidateNested()
  @Type(() => ViewsType)
  views: { count: number };
}
