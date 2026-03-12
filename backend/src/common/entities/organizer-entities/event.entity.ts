import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { OrganizerEntity } from './organizer.entity';
import { AttendeeEntity } from './attendee.entity';
import { EventCategory } from './enums/eventCategory.enum';
import { EventStatus } from './enums/eventStatus.enum';

@Entity('events')
export class EventEntity {
    @PrimaryGeneratedColumn()
    eventId: number;

    @Column()
    eventTitle: string;

    @Column('text')
    eventDescription: string;

    @Column({ type: 'date' })
    eventDate: Date;

    @Column()
    eventTime: string;

    @Column()
    eventLocation: string;

    @Column({
        type: 'enum',
        enum: EventCategory,
        default: EventCategory.OTHER,
    })
    eventCategory: EventCategory;

    @Column({
        type: 'enum',
        enum: EventStatus,
        default: EventStatus.UPCOMING,
    })
    eventStatus: EventStatus;

    // Relation 1: Organizer -> Event
    @ManyToOne(() => OrganizerEntity, (organizer) => organizer.events, {
        onDelete: 'CASCADE',
    })
    organizer: OrganizerEntity;

    // Relation 2: Event <-> Attendee
    @ManyToMany(() => AttendeeEntity, (attendee) => attendee.events)
    @JoinTable()
    attendees: AttendeeEntity[];
}
