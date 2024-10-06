export type VKResponseApiErrorType = {
  error: {
    error_code: number;
    error_msg: string;
    request_params: RequestParamType[];
  };
};

export type VKResponseAuthErrorType = {
  error: number;
  error_description: string;
};

type RequestParamType = {
  key: string;
  value: string;
};
