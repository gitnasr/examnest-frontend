export interface AuthenticationDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
}

export interface RefreshTokenDTO {
  refreshToken: string;
  accessToken: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserInfo;
}

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  branchId?: number;
  trackId?: number;
}

export enum UserRole {
  Student = 0,
  Instructor = 1,
  Admin = 2,
  SuperAdmin = 3
}

export interface TokenPayload {
  jti: string;
  unique_name: string;
  nameid: string;
  email: string;
  name?: string;
  role: string;
  nbf: number;
  exp: number;
  iat: number;
  iss: string;
  aud: string;
  sub?: string; // Optional for backward compatibility
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
} 