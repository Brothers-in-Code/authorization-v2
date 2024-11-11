// TODO доделать все типы
type VKWallType = {
  response: {
    count: number;
    items: PostType[];
  };
};

export type PostType = {
  inner_type: string;
  donut: { is_donut: boolean };
  comments: CommentsType;
  marked_as_ads: number;
  hash: string;
  type: string;
  carousel_offset: number;
  attachments: AttachmentType[];
  date: number;
  from_id: number;
  id: number;
  is_favorite: boolean;
  likes: LikesType;
  reaction_set_id: string;
  reactions: ReactionsType;
  owner_id: number;
  post_source: { type: string };
  post_type: string;
  reposts: { count: number; user_reposted: number };
  signer_id: number;
  text: string;
  views: { count: number };
};

type ReactionsType = {
  count: number;
  user_reaction: number;
  items: { id: number; count: number }[];
};

type AttachmentType = {
  type: string;
  photo: PhotoType;
};

type PhotoType = {
  album_id: number;
  date: number;
  id: number;
  owner_id: number;
  access_key: string;
  sizes: SizeType[];
  text: string;
  user_id: number;
  web_view_token: string;
  has_tags: boolean;
  orig_photo: SizeType;
};

type SizeType = {
  height: number;
  type: string;
  url: string;
  width: number;
};

type CommentsType = {
  can_post: number;
  can_view: number;
  count: number;
  groups_can_post: number;
};

type LikesType = {
  count: number;
  user_likes: number;
  can_like: number;
  can_publish: number;
  repost_disabled: boolean;
};

export { VKWallType };
