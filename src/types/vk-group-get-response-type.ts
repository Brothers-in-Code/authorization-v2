type VKMethodGroupsGetResponseType = {
  response: {
    count: number;
    items: VKGroupType[];
    last_updated_time: number;
  };
};

type VKMethodGroupsGetByIdResponseType = {
  response: {
    groups: VKGroupType[];
    profiles: any[];
  };
};

type VKGroupType = {
  id: number;
  is_closed: number;
  name: string;
  photo_50: string;
  photo_100: string;
  photo_200: string;
  screen_name: string;
  type: string;
};

export {
  VKMethodGroupsGetResponseType,
  VKMethodGroupsGetByIdResponseType,
  VKGroupType,
};
