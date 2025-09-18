interface Payload {
  password: string;
}

export interface SignupPayload extends Payload {
  displayname?: string;
  username: string;
  email: string;
}

export interface LoginPayload extends Payload {
  identifier: string;
}
