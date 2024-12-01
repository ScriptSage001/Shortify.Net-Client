export interface RegisterUserRequest {
    userName: string | null,
    email: string | null,
    password: string | null,
    confirmPassword: string | null,
    validateOtpToken: string
}