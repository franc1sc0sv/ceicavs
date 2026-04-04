import 'reflect-metadata'
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(__dirname, '../../../.env') })

async function bootstrap() {
  const { NestFactory } = await import('@nestjs/core')
  const { ValidationPipe } = await import('@nestjs/common')
  const { AppModule } = await import('./app.module')

  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  app.enableCors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173' })
  await app.listen(process.env.PORT ?? 3001)
}

bootstrap().catch((err) => {
  console.error(err)
  process.exit(1)
})
