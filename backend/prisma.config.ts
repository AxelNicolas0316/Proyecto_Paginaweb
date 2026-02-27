// backend/prisma.config.ts
import { defineConfig } from '@prisma/config'

const databaseUrl = "postgresql://postgres:Soriano03@localhost:5432/suministros_db?schema=public"

export default defineConfig({
  datasource: {
    url: databaseUrl, // <-- ESTA COMA ES IMPORTANTE
  },
  schema: 
     "prisma/schema.prisma",

})