import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne } from 'typeorm';
import { EventEntity } from './event.entity';
import { AttendeeRole } from './enums/attendeeRole.enum';
import { Gender } from './enums/gender.enum';
import { AttendeeStatus } from './enums/attendeeStatus.enum';
import { OrganizerEntity } from './organizer.entity';

@Entity('attendees')
export class AttendeeEntity {
    @PrimaryGeneratedColumn()
    attendeeId: number;

    @Column()
    attendeeName: string;

    @Column()
    attendeeEmail: string;

    @Column()
    attendeePhone: string;

    @Column({
        type: 'enum',
        enum: Gender,
    })
    attendeeGender: Gender;

    @Column({
        type: 'enum',
        enum: AttendeeRole,
        default: AttendeeRole.STUDENT,
    })
    attendeeRole: AttendeeRole;

    @Column({
        type: 'enum',
        enum: AttendeeStatus,
        default: AttendeeStatus.ACTIVE,
    })
    attendeeStatus: AttendeeStatus;

    @ManyToOne(() => OrganizerEntity, (organizer) => organizer.attendee, {
        onDelete: 'CASCADE',
    })
    organizer: OrganizerEntity;

    @ManyToMany(() => EventEntity, (event) => event.attendees)
    events: EventEntity[];


}
