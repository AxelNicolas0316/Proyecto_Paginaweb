// backend/prisma.config.ts
import dotenv from 'dotenv'
dotenv.config()
import { defineConfig } from '@prisma/config'

const databaseUrl = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?schema=public`

export default defineConfig({
  datasource: {
    url: databaseUrl, // <-- ESTA COMA ES IMPORTANTE
  },
  schema: 
     "prisma/schema.prisma",

})