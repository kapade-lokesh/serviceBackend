class ApiResponse {
  public success: boolean;
  public statusCode: number;
  public data: any;
  public message: string;
  public error: any;
  constructor(
    sucess: boolean,
    statusCode: number,
    message: string,
    data: any = null,
    error: any = null
  ) {
    this.success = sucess;
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.error = error;
  }
}

export { ApiResponse };
