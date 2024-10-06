export type VKErrorType = {
  error_code: number;
  error_msg: string;
  request_params: RequestParamType[];
};

type RequestParamType = {
  key: string;
  value: string;
};
