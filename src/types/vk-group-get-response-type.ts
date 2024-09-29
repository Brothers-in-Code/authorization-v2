type GroupGetResponseType = {
  response: {
    count: number;
    items: GroupType[];
    last_updated_time: number;
  };
};

type GroupType = {
  id: number;
  is_closed: number;
  name: string;
  photo_50: string;
  photo_100: string;
  photo_200: string;
  screen_name: string;
  type: string;
};

export { GroupGetResponseType, GroupType };
