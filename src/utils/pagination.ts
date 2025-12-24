/**
 * Make pagination
 * @param offset 
 * @param limit 
 * @param count 
 * @returns { next: { offset: number, limit: number } | null, previous: { offset: number, limit: number } | null }
 */
export const pagination = (offset: number, limit: number, count: number) => {
    limit = limit === 0 ? 10 : limit;

    let nextOfsset = offset + limit;

    const next = nextOfsset < count ? { 'offset': nextOfsset, 'limit': limit } : null;

    let prevOffset = offset - limit;
    if (prevOffset < 0) {
        prevOffset = 0;
    }

    const previous = offset > 0 ? { 'offset': prevOffset, 'limit': limit } : null;


    return { next, previous };
}