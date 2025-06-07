import dotenv from "dotenv";
dotenv.config({ path: "../server/.env" });

export const PORT = process.env.PORT;
export const mongoDbUrl = process.env.MONGO_DB_URL;
export const BASE_API_PATH = process.env.BASE_API_PATH;
export const API_KEY = process.env.API_KEY;
export const JWT_SECRET = process.env.JWT_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const EVENTS_SEARCH_PATH = `${BASE_API_PATH}/events`;
export const GENRES_PATH = `${BASE_API_PATH}/classifications`;
