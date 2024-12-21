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
    rowStatus?: boolean,
    isCopiedFromCard?: boolean,
    isCopiedFromShareModal?: boolean
}