import { HttpStatus } from '@nestjs/common';

export type SuccessResponseType<T> = {
  success: ResponseInfoType;
  data: T;
};

export type ErrorResponseType = {
  error: ResponseInfoType;
};

export type ResponseInfoType = {
  status: HttpStatus;
  message: string;
  code: string;
};
