// TODO доделать все типы
type VKWallType = {
  count: number;
  items: PostType[];
};

type PostType = {
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

const response1 = {
  response: {
    count: 42,
    items: [
      {
        inner_type: 'wall_wallpost',
        donut: {
          is_donut: false,
        },
        comments: {
          can_post: 1,
          can_view: 1,
          count: 4,
          groups_can_post: true,
        },
        marked_as_ads: 0,
        hash: '1kHaIMnTb2Uy36DXWYOOTdns8w',
        type: 'post',
        carousel_offset: 0,
        attachments: [
          {
            type: 'photo',
            photo: {
              album_id: -7,
              date: 1720938443,
              id: 457239261,
              owner_id: -210262775,
              access_key: 'f4ffc084d23a0527e2',
              sizes: [
                {
                  height: 58,
                  type: 'm',
                  width: 130,
                  url: 'https://sun9-19.userapi.com/s/v1/ig2/wLmfKmo3dpLKg1y7RDeODmHOw10lHxxcfy_hDCPv58xO72zpfEJN6S6sdv1IbZLfxAg241MOwqlEugwN6hZHbW7C.jpg?quality=96&as=32x14,48x22,72x32,108x49,160x72,240x108,360x162,480x216,540x243,640x288,720x324,1080x486,1280x576&from=bu&cs=130x58',
                },
              ],
              text: '',
              user_id: 100,
              web_view_token: 'c3f1b5691d27889a5c',
              has_tags: false,
              orig_photo: {
                height: 576,
                type: 'base',
                url: 'https://sun9-19.userapi.com/s/v1/ig2/wLmfKmo3dpLKg1y7RDeODmHOw10lHxxcfy_hDCPv58xO72zpfEJN6S6sdv1IbZLfxAg241MOwqlEugwN6hZHbW7C.jpg?quality=96&as=32x14,48x22,72x32,108x49,160x72,240x108,360x162,480x216,540x243,640x288,720x324,1080x486,1280x576&from=bu',
                width: 1280,
              },
            },
          },
        ],
        date: 1720938443,
        from_id: -210262775,
        id: 89,
        is_favorite: false,
        likes: {
          can_like: 0,
          count: 5,
          user_likes: 1,
          can_publish: 1,
          repost_disabled: false,
        },
        reaction_set_id: 'reactions',
        reactions: {
          count: 5,
          items: [
            {
              id: 0,
              count: 5,
            },
          ],
          user_reaction: 0,
        },
        owner_id: -210262775,
        post_source: {
          type: 'api',
        },
        post_type: 'post',
        reposts: {
          count: 0,
          user_reposted: 0,
        },
        text: 'Самый мощный в мире не побоюсь этого сказать, рюкзак. Трёхдневный , усиленно всё, что можно усилить, не пожалел ничего в это изделие, можно смело таскать свинец, ценник 28.000. Практически вложено два рюкзака в один по материалам. Оригинальная версия довольно скудная, сюда же запихнул всё что не хватало в том числе и карманы, и на и панелька на липучке, можно её в принципе убрать и смело запихивать туда шлем. Прошито так как не одна фабрика и бренд не станет прошивать иначе будет очень дорого для них. Такая вещь не подведёт в нужный момент. Приверженцев брендового фабричного фуфла просьба проходить мимо. Здесь всё вручную и от души. Продаётся.',
        views: {
          count: 79,
        },
      },
    ],
    profiles: [
      {
        id: 100,
        sex: 0,
        screen_name: 'id100',
        photo_50:
          'https://sun9-68.userapi.com/s/v1/ig2/TsexrsG7JVugQbgZWzHitEDehEBR97lv-mu0E6g3bWC7s7nSFF2pGq85vCvoMQ9g4QWwbOcI8n--074hD4p8zLHR.jpg?quality=95&crop=0,0,1000,1000&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720&ava=1&cs=50x50',
        photo_100:
          'https://sun9-68.userapi.com/s/v1/ig2/TsexrsG7JVugQbgZWzHitEDehEBR97lv-mu0E6g3bWC7s7nSFF2pGq85vCvoMQ9g4QWwbOcI8n--074hD4p8zLHR.jpg?quality=95&crop=0,0,1000,1000&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720&ava=1&cs=100x100',
        online_info: {
          visible: true,
          is_online: false,
          is_mobile: false,
        },
        online: 0,
        first_name: 'ВКонтакте',
        last_name: '',
        can_access_closed: true,
        is_closed: false,
      },
    ],
    groups: [
      {
        id: 210262775,
        name: '"Топовые Вещи" A100_Nix Качество',
        screen_name: 'club210262775',
        is_closed: 0,
        type: 'page',
        photo_50:
          'https://sun9-43.userapi.com/s/v1/ig2/9kT9xGj8L_9jnXukN1Z9oiMywINEe3MPeE5EWp6HZ36FY7qzgnE7tjUihkiiZ9qNwygQEf0UOa3FC3mL8hDs-kyu.jpg?quality=95&crop=656,301,1008,1008&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720&ava=1&cs=50x50',
        photo_100:
          'https://sun9-43.userapi.com/s/v1/ig2/9kT9xGj8L_9jnXukN1Z9oiMywINEe3MPeE5EWp6HZ36FY7qzgnE7tjUihkiiZ9qNwygQEf0UOa3FC3mL8hDs-kyu.jpg?quality=95&crop=656,301,1008,1008&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720&ava=1&cs=100x100',
        photo_200:
          'https://sun9-43.userapi.com/s/v1/ig2/9kT9xGj8L_9jnXukN1Z9oiMywINEe3MPeE5EWp6HZ36FY7qzgnE7tjUihkiiZ9qNwygQEf0UOa3FC3mL8hDs-kyu.jpg?quality=95&crop=656,301,1008,1008&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720&ava=1&cs=200x200',
      },
    ],
    reaction_sets: [
      {
        id: 'reactions',
        items: [
          {
            id: 0,
            title: 'Нравится',
            asset: {
              animation_url:
                'https://vk.com/reaction/3-reactions-0?c_uniq_tag=83b2081a8e4adfc36ee536f5f1b4ad470174c89678369a4b9dc5547614a3955e',
              images: [
                {
                  url: 'https://vk.com/reaction/1-reactions-0-32?c_uniq_tag=464ba6bdc06e9f204a9b2c865a046355d835f601d8d82be4dc77e43a028741ff',
                  width: 32,
                  height: 32,
                },
              ],
              title: {
                color: {
                  foreground: {
                    light: 'FF3347',
                    dark: 'FF5C5C',
                  },
                  background: {
                    light: 'FFEDED',
                    dark: '3E2526',
                  },
                },
              },
              title_color: {
                light: 'FF3347',
                dark: 'FF5C5C',
              },
            },
          },
        ],
      },
    ],
  },
};
