export interface ShortenLink {
    id: string,
    userId: string,
    originalUrl: string,
    shortUrl: string,
    code: string,
    title?: string | null,
    tags?: string[] | null,
    createdOnUtc: string,
    updatedOnUtc?: string | null,
    isCopiedFromCard?: boolean,
    isCopiedFromShareModal?: boolean
}