export interface Me {
  userId: string;
  role: string;
  isDemo?: boolean;
}

export interface RegisterResponse {
  success: boolean;
  statusCode: number;
  message: string;
  email: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  statusCode: number;
  message: string;
  role: string;
}

export interface LoginPayload {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  resetToken: string;
  newPassword: string;
}

export interface Profile {
  fullName: string;
  username: string;
  email: string;
  profile_url: string;
  role: string;
}

export interface UpdateUserPayload {
  fullName?: string;
  image?: File[];
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
