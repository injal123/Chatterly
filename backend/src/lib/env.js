import "dotenv/config";

export const ENV = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    NODE_ENV: process.env.NODE_ENV,
    JWT_SECRET: process.env.JWT_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME,
    EMAIL_FROM: process.env.EMAIL_FROM,
    CLIENT_URL: process.env.CLIENT_URL,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    ARCJET_API_KEY: process.env.ARCJET_API_KEY,
    ARCJET_ENV: process.env.ARCJET_ENV
};


if (!ENV.MONGO_URI) {
    console.warn("Warning: MONGO_URI is not defined in environment variables.");
}

if (!ENV.JWT_SECRET) {
    console.warn("Warning: JWT_SECRET is not defined in environment variables.");
}

if (!ENV.RESEND_API_KEY) {
    console.warn("Warning: RESEND_API_KEY is not defined in environment variables.");
}

if (!ENV.CLIENT_URL) {
    console.warn("Warning: CLIENT_URL is not defined in environment variables.");
}

if (!ENV.CLOUDINARY_CLOUD_NAME) {
    console.warn("Warning: CLOUDINARY_CLOUD_NAME is not defined in environment variables.");
}

if (!ENV.CLOUDINARY_API_KEY) {
    console.warn("Warning: CLOUDINARY_API_KEY is not defined in environment variables.");
}

if (!ENV.CLOUDINARY_API_SECRET) {
    console.warn("Warning: CLOUDINARY_API_SECRET is not defined in environment variables.");
}

if (!ENV.ARCJET_API_KEY) {
    console.warn("Warning: ARCJET_API_KEY is not defined in environment variables.");
}

if (!ENV.ARCJET_ENV) {
    console.warn("Warning: ARCJET_ENV is not defined in environment variables.");
}