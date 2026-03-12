import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { EventEntity } from './event.entity';
import { Gender } from './enums/gender.enum';
import { AttendeeEntity } from './attendee.entity';

@Entity('organizers')
export class OrganizerEntity {
    @PrimaryGeneratedColumn()
    organizerId: number;

    @Column()
    organizerName: string;

    @Column({ unique: true })
    organizerEmail: string;

    @Column({ unique: true })
    organizerPhone: string;

    @Column({
        type: 'enum',
        enum: Gender,
    })
    organizerGender: Gender;

    @Column({ type: 'date' })
    organizerDob: Date;

    @Column({ type: 'date' })
    organizerJoiningDate: Date;

    @Column()
    organizerPassword: string;

    // One-to-Many relation with Attendee
    @OneToMany(() => AttendeeEntity, (attendee) => attendee.organizer)
    attendee: AttendeeEntity[];

    // One-to-Many relation with Event
    @OneToMany(() => EventEntity, (event) => event.organizer)
    events: EventEntity[];
}
