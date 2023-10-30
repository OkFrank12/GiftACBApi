export enum RESPONSE {
  OK = 200,
  CREATED = 201,
  NOT_FOUND = 404,
  NOT_FULLFILLED = 500,
  NOT_VERIFIED = 403,
  NOT_AUTHORIZED = 401,
  UPDATED = 200,
  DELETE = 202,
}

interface iResponse {
  name: string;
  message: string;
  status: RESPONSE;
  success: boolean;
}

export class errorSet extends Error {
  public readonly name: string;
  public readonly message: string;
  public readonly status: RESPONSE;
  public readonly success: boolean = false;

  constructor(args: iResponse) {
    super(args.message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = args.name;
    this.message = args.message;
    this.status = args.status;

    if (this.success !== undefined) {
      this.success = args.success;
    }

    Error.captureStackTrace(this);
  }
}
