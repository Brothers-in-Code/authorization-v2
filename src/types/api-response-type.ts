import { HttpStatus } from '@nestjs/common';

export type SuccessResponseType = {
  success: ResponseInfoType;
  data: any;
};

export type ErrorResponseType = {
  error: ResponseInfoType;
};

export type ResponseInfoType = {
  status: HttpStatus;
  message: string;
  code: string;
};
