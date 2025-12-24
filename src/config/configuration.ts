export default () => ({
    api: {
        url: process.env.API_URL,
        port: +process.env.API_PORT! || 3000,
        prefix: process.env.API_PREFIX,
    },
    database: {
        host: process.env.POSTGRES_HOST,
        port: +process.env.POSTGRES_PORT! || 5432,
        user: process.env.POSTGRES_USERNAME,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
    },
    jwt: {
        access_token_secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        access_token_expires_in: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
        refresh_token_secret: process.env.JWT_REFRESH_TOKEN_SECRET,
        refresh_token_expires_in: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
    }
})