export type VKResponseTokenType = {
  refresh_token: string;
  access_token: string;
  token_type: string;
  expires_in: number;
  user_id: number;
  scope: string;
  state: string;
};
