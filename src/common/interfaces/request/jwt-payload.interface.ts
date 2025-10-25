export interface JwtPayload {
  sub: number;
  name: string;
  email: string;
  decryptKey?: string;
  iat?: number;
  exp?: number;
}
