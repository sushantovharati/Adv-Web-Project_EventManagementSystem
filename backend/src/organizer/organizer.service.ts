import { Injectable, NotFoundException, ConflictException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { EventEntity } from 'src/common/entities/organizer-entities/event.entity';
import { AttendeeEntity } from 'src/common/entities/organizer-entities/attendee.entity';
import { CreateEventDto } from 'src/common/dto/organizer-dto/event-dto/create-event.dto';
import { UpdateEventDto } from 'src/common/dto/organizer-dto/event-dto/update-event.dto';
import { CreateAttendeeDto } from 'src/common/dto/organizer-dto/attendee-dto/create-attendee.dto';
import { UpdateAttendeeDto } from 'src/common/dto/organizer-dto/attendee-dto/update-attendee.dto';
import { MailService } from 'src/common/mailer/organizer-mailer/mailer.service';
import { OrganizerEntity } from 'src/common/entities/organizer-entities/organizer.entity';
import { ChangePasswordDto } from 'src/common/dto/organizer-dto/change-password.dto';
import { UpdateOrganizerDto } from 'src/common/dto/organizer-dto/update-organizer.dto';
import { OrganizerPusherService } from 'src/common/pusher/organizer-pusher/organizer-pusher.service';
import { EventStatus } from 'src/common/entities/organizer-entities/enums/eventStatus.enum';
import { PublicEventsQueryDto } from 'src/common/dto/organizer-dto/event-dto/public-events-query.dto';

@Injectable()
export class OrganizerService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepo: Repository<EventEntity>,
    @InjectRepository(AttendeeEntity)
    private readonly attendeeRepo: Repository<AttendeeEntity>,
    @InjectRepository(OrganizerEntity)
    private readonly organizerRepo: Repository<OrganizerEntity>,
    private readonly mailService: MailService,
    private readonly organizerPusher: OrganizerPusherService,
  ) { }

  // EVENTS CRUD
  // Create new events
  async createEvent(dto: CreateEventDto, organizerId: number) {
    const event = this.eventRepo.create({
      ...dto,
      organizer: { organizerId },
    });

    const saved = await this.eventRepo.save(event);

    await this.organizerPusher.eventCreated(organizerId, {
      id: saved.eventId ?? saved.eventId,
      title: saved.eventTitle,
    });

    return saved;
  }

  // Get all events
  async getAllEvents() {
    return this.eventRepo.find({
      relations: { organizer: true, attendees: true },
      order: { eventId: 'DESC' },
    });
  }

  // Get event by id
  async getEventById(eventId: number) {
    const event = await this.eventRepo.findOne({
      where: { eventId },
      relations: { organizer: true, attendees: true },
    });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  //update event
  async updateEvent(eventId: number, dto: UpdateEventDto) {
    const event = await this.getEventById(eventId);
    Object.assign(event, dto);
    return this.eventRepo.save(event);
  }

  // delete an event
  async deleteEvent(eventId: number) {
    const event = await this.getEventById(eventId);
    await this.eventRepo.remove(event);
    return { message: 'Event deleted successfully' };
  }

  // Landing page show events
  async getPublicEvents(q: PublicEventsQueryDto) {
    const limit = q.limit ?? 6;

    const qb = this.eventRepo
      .createQueryBuilder("e")
      .select([
        "e.eventId",
        "e.eventTitle",
        "e.eventDescription",
        "e.eventDate",
        "e.eventTime",
        "e.eventLocation",
        "e.eventStatus",
        "e.eventCategory",
      ])
      .orderBy("e.eventDate", "ASC")
      .addOrderBy("e.eventTime", "ASC")
      .take(limit);

    if (q.status) {
      qb.where("e.eventStatus = :status", { status: q.status });
    }

    const events = await qb.getMany();

    return events.map((e) => ({
      eventId: e.eventId,
      eventTitle: e.eventTitle,
      eventDescription: e.eventDescription,
      eventDate: e.eventDate,
      eventTime: e.eventTime,
      eventLocation: e.eventLocation,
      eventStatus: e.eventStatus,
      eventCategory: e.eventCategory,
    }));
  }

  // ATTENDEES CRUD
  async createAttendee(dto: CreateAttendeeDto, organizerId: number) {

    const attendee = this.attendeeRepo.create({ ...dto, organizer: { organizerId }, });

    const saved = await this.attendeeRepo.save(attendee);

    // email send mailer
    try {
      await this.mailService.sendAttendeeWelcome(saved.attendeeEmail, saved.attendeeName);
      console.log('Mail sent to:', saved.attendeeEmail);
    } catch (e) {
      console.log('Mail failed:', e);
    }

    //pusher notification
    await this.organizerPusher.attendeeCreated(organizerId, {
      id: saved.attendeeId ?? saved.attendeeId,
      name: saved.attendeeName,
    });

    return saved;
  }

  // Attendees crud
  async getAllAttendees() {
    return this.attendeeRepo.find({
      relations: { events: true },
      order: { attendeeId: 'DESC' },
    });
  }

  async getAttendeeById(attendeeId: number) {
    const attendee = await this.attendeeRepo.findOne({
      where: { attendeeId },
      relations: { events: true },
    });
    if (!attendee) throw new NotFoundException('Attendee not found');
    return attendee;
  }

  async updateAttendee(attendeeId: number, dto: UpdateAttendeeDto) {
    const attendee = await this.getAttendeeById(attendeeId);

    if (dto.attendeeEmail) dto.attendeeEmail = dto.attendeeEmail.trim().toLowerCase();
    if (dto.attendeePhone) dto.attendeePhone = dto.attendeePhone.replace(/\s+/g, '');

    Object.assign(attendee, dto);
    return this.attendeeRepo.save(attendee);
  }

  async deleteAttendee(attendeeId: number) {
    const attendee = await this.getAttendeeById(attendeeId);
    await this.attendeeRepo.remove(attendee);
    return { message: 'Attendee deleted successfully' };
  }

  // EVENT <-> ATTENDEE 
  async addAttendeeToEvent(eventId: number, attendeeId: number) {
    const event = await this.getEventById(eventId);
    const attendee = await this.getAttendeeById(attendeeId);

    event.attendees = event.attendees || [];
    const already = event.attendees.some((a) => a.attendeeId === attendeeId);
    if (already) return { message: 'Attendee already added to this event' };

    event.attendees.push(attendee);
    await this.eventRepo.save(event);

    return { message: 'Attendee added to event successfully' };
  }

  async removeAttendeeFromEvent(eventId: number, attendeeId: number) {
    const event = await this.getEventById(eventId);

    event.attendees = (event.attendees || []).filter(
      (a) => a.attendeeId !== attendeeId,
    );

    await this.eventRepo.save(event);
    return { message: 'Attendee removed from event successfully' };
  }

  async getAttendeesOfEvent(eventId: number) {
    const event = await this.getEventById(eventId);
    return event.attendees || [];
  }

  // <<<---------------Organizer Section----------------->>>
  // Get info of organizer
  async getProfileById(organizerId: number) {
    const organizer = await this.organizerRepo.findOne({
      where: { organizerId },
    });

    if (!organizer) {
      throw new NotFoundException('Organizer not found');
    }

    const { organizerPassword, ...safe } = organizer as any;

    return safe;
  }

  // Profile stats
  async getProfileStats(organizerId: number) {
    const totalEvents = await this.eventRepo.count({
      where: { organizer: { organizerId } as any },
    });

    const completedEvents = await this.eventRepo.count({
      where: { organizer: { organizerId } as any, eventStatus: EventStatus.COMPLETED as any },
    });

    const totalAttendees = await this.attendeeRepo.count({
      where: { organizer: { organizerId } as any },
    });

    return { totalEvents, completedEvents, totalAttendees };
  }


  // Delete Account
  async deleteOrganizerAccount(organizerId: number) {
    const organizer = await this.organizerRepo.findOne({ where: { organizerId } });
    if (!organizer) throw new NotFoundException('Organizer not found');

    await this.organizerRepo.remove(organizer);
    return { message: 'Organizer account deleted successfully' };
  }

  // Change Password 
  async changePassword(organizerId: number, dto: ChangePasswordDto) {
    if (!organizerId) {
      throw new BadRequestException('Invalid organizer token payload');
    }

    const organizer = await this.organizerRepo.findOne({
      where: { organizerId },
      select: [
        'organizerId',
        'organizerPassword',
      ],
    });

    if (!organizer) {
      throw new NotFoundException('Organizer not found');
    }

    // old password verify
    const isMatch = await bcrypt.compare(dto.oldPassword, organizer.organizerPassword);
    if (!isMatch) {
      throw new ForbiddenException('Old password is incorrect');
    }

    // avoid same password
    if (dto.oldPassword === dto.newPassword) {
      throw new BadRequestException('New password must be different from old password');
    }

    const saltRounds = 10;
    organizer.organizerPassword = await bcrypt.hash(dto.newPassword, saltRounds);

    await this.organizerRepo.save(organizer);

    return { message: 'Password changed successfully' };
  }

  // Update Organizer Info
  async updateOrganizer(organizerId: number, dto: UpdateOrganizerDto) {
    const organizer = await this.organizerRepo.findOne({
      where: { organizerId },
    });

    if (!organizer) {
      throw new NotFoundException('Organizer not found');
    }

    // update only provided fields
    Object.assign(organizer, dto);

    await this.organizerRepo.save(organizer);

    return {
      message: 'Organizer information updated successfully',
    };
  }

}
