export interface AuthResponse {
    userId: string,
    accessToken: string,
    refreshToken: string,
    refreshTokenExpirationTimeUtc: string
}