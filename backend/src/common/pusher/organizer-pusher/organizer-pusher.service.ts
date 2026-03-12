import { Injectable } from '@nestjs/common';
import Pusher from 'pusher';

@Injectable()
export class OrganizerPusherService {
  private readonly pusher: Pusher;

  constructor() {
    this.pusher = new Pusher({
      appId: process.env.PUSHER_APP_ID!,
      key: process.env.PUSHER_KEY!,
      secret: process.env.PUSHER_SECRET!,
      cluster: process.env.PUSHER_CLUSTER!,
      useTLS: true,
    });
  }

  async notify(organizerId: number, eventName: string, payload: any) {
    const channel = `organizer-${organizerId}`;
    return this.pusher.trigger(channel, eventName, payload);
  }

  async eventCreated(organizerId: number, data: { id: number; title: string }) {
    return this.notify(organizerId, 'event.created', {
      message: 'Event created',
      ...data,
      createdAt: new Date().toISOString(),
    });
  }

  async attendeeCreated(
    organizerId: number,
    data: { id: number; name?: string; email?: string },
  ) {
    return this.notify(organizerId, 'attendee.created', {
      message: 'Attendee added',
      ...data,
      createdAt: new Date().toISOString(),
    });
  }
}
