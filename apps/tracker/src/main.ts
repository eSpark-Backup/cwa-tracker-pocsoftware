import { NestFactory } from '@nestjs/core';
import { TrackerModule } from './tracker.module';

async function bootstrap() {
  const app = await NestFactory.create(TrackerModule);
  await app.listen(process.env.port ?? 3001);
}
bootstrap();
