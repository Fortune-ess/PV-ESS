import * as dotenv from 'dotenv'
import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { User } from '../entities/User'

dotenv.config()

const appDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'postgres',
  port: Number(process.env.POSTGRES_PORT) || 5432,
  username: process.env.POSTGRES_USER || 'admin',
  password: process.env.POSTGRES_PASSWORD || 'password',
  database: process.env.POSTGRES_NAME || 'auth_db',
  entities: [User],
  migrations:
    process.env.NODE_ENV === 'production'
      ? ['dist/migration/*.js']
      : ['src/migration/*.ts'],
  synchronize: true,
  logging: true,
})
export default appDataSource
