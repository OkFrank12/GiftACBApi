import dot from "dotenv";
dot.config();

export const environment = {
  PORT: process.env.PORT!,
  MONGO_CONNECT: process.env.MONGO_CONNECT!,
  TOKEN_SECRET: process.env.TOKEN_SECRET!,
  G_ID: process.env.G_ID!,
  G_SECRET: process.env.G_SECRET!,
  G_URL: process.env.G_URL!,
  G_REFRESH: process.env.G_REFRESH!,
  CLOUD_NAME: process.env.CLOUD_NAME!,
  CLOUD_KEY: process.env.CLOUD_KEY!,
  CLOUD_SECRET: process.env.CLOUD_SECRET!,
};
