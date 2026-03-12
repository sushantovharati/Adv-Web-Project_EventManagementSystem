import { Module } from '@nestjs/common';
import { OrganizerModule } from './organizer/organizer.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
    envFilePath: '.env',
   }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true
    }),
    OrganizerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
