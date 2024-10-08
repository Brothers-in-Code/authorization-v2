export type VKUserInfoType = {
  response: { user: VKUser };
};

export type VKUser = {
  user_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  avatar: string;
  email: string;
  sex: number;
  is_verified: boolean;
  birthday: string;
};
