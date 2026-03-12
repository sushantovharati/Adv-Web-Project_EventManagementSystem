import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrganizerEntity } from 'src/common/entities/organizer-entities/organizer.entity';
import { JwtStrategy } from './jwt.strategy';
import { OrganizerAuthService } from './auth.service';
import { OrganizerAuthController } from './auth.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrganizerEntity]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'CampusEventsSecret2025',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [OrganizerAuthController],
  providers: [OrganizerAuthService, JwtStrategy],
  exports: [OrganizerAuthService, JwtModule, PassportModule],
})
export class OrganizerAuthModule {}
