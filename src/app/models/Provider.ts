export interface Provider {
    id?: number,
    fullname: string,
    phone: string,
    pivot: {
        article_id: number,
        provider_id: number
    }
}