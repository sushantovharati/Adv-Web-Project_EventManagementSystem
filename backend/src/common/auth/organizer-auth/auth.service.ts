import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OrganizerEntity } from 'src/common/entities/organizer-entities/organizer.entity';
import { hashPassword, comparePassword } from './bcrypt.helper';
import { HttpErr } from './http-exception.helper';

@Injectable()
export class OrganizerAuthService {
  constructor(
    @InjectRepository(OrganizerEntity)
    private readonly organizerRepo: Repository<OrganizerEntity>,
    private readonly jwtService: JwtService,
  ) {}

  // REGISTER (bcrypt hash)
  async register(payload: {
    organizerName: string;
    organizerEmail: string;
    organizerPhone: string;
    organizerGender: any;
    organizerDob: Date;
    organizerJoiningDate: Date;
    organizerPassword: string;
  }) {
    const email = payload.organizerEmail.trim().toLowerCase();
    const phone = payload.organizerPhone.replace(/\s+/g, '');

    const existing = await this.organizerRepo.findOne({
      where: [{ organizerEmail: email }, { organizerPhone: phone }],
    });

    if (existing) {
      throw HttpErr.conflict('Organizer email or phone already exists');
    }

    const hashed = await hashPassword(payload.organizerPassword);

    const organizer = this.organizerRepo.create({
      ...payload,
      organizerEmail: email,
      organizerPhone: phone,
      organizerPassword: hashed,
    });

    const saved = await this.organizerRepo.save(organizer);

    return {
      organizerId: saved.organizerId,
      organizerName: saved.organizerName,
      organizerEmail: saved.organizerEmail,
      organizerPhone: saved.organizerPhone,
    };
  }

  // LOGIN (bcrypt compare)
  async login(payload: { organizerEmail: string; organizerPassword: string }) {
    const email = payload.organizerEmail.trim().toLowerCase();

    const organizer = await this.organizerRepo.findOne({
      where: { organizerEmail: email },
    });

    if (!organizer) {
      throw HttpErr.unauthorized('Invalid email or password');
    }

    const ok = await comparePassword(
      payload.organizerPassword,
      organizer.organizerPassword,
    );

    if (!ok) {
      throw HttpErr.unauthorized('Invalid email or password');
    }

    const token = await this.signToken({
      sub: organizer.organizerId,
      email: organizer.organizerEmail,
    });

    return {
      access_token: token,
      organizer: {
        organizerId: organizer.organizerId,
        organizerName: organizer.organizerName,
        organizerEmail: organizer.organizerEmail,
      },
    };
  }

  // Token Sign
  private async signToken(payload: { sub: number; email: string }) {
    return this.jwtService.signAsync(payload);
  }
}
