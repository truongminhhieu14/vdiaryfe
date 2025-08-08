export type SuccessResponse<T> = {
  message: string;
  metadata: T;
  statusCode: number;
  reasonStatusCode: string;
};

export type ErrorResponse = {
  message: string;
  statusCode: number;
  status: string
};

export type authResponse = SuccessResponse<{
  user: {
    _id: string;
    username: string;
    email: string;
  };
  accessToken: string;
  refreshToken: string;
}>;
