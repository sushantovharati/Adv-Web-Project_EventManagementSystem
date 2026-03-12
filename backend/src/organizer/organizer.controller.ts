import { Body, Controller, Delete, Get, Patch, Post, Param, UseGuards, UsePipes, ValidationPipe, Res, Req, Query } from '@nestjs/common';
import { OrganizerService } from './organizer.service';
import { JwtAuthGuard } from 'src/common/auth/organizer-auth/jwt.guard';
import { EventValidationPipe } from 'src/common/pipes/organizer-validation/event-validation.pipe';
import { AttendeeValidationPipe } from 'src/common/pipes/organizer-validation/attendee-validation.pipe';
import { PositiveIntPipe } from 'src/common/pipes/organizer-validation/positive-int.pipe';
import { CreateEventDto } from 'src/common/dto/organizer-dto/event-dto/create-event.dto';
import { UpdateEventDto } from 'src/common/dto/organizer-dto/event-dto/update-event.dto';
import { CreateAttendeeDto } from 'src/common/dto/organizer-dto/attendee-dto/create-attendee.dto';
import { UpdateAttendeeDto } from 'src/common/dto/organizer-dto/attendee-dto/update-attendee.dto';
import { OrganizerValidationPipe } from 'src/common/pipes/organizer-validation/organizer-validation.pipe';
import { CreateOrganizerDto } from 'src/common/dto/organizer-dto/create-organizer.dto';
import { OrganizerAuthService } from 'src/common/auth/organizer-auth/auth.service';
import { LoginDto } from 'src/common/dto/organizer-dto/login-dto/login.dto';
import { clearAuthCookie, setAuthCookie } from 'src/common/auth/organizer-auth/login-cookie.helper';
import type { Response } from 'express';
import { ChangePasswordDto } from 'src/common/dto/organizer-dto/change-password.dto';
import { UpdateOrganizerValidationPipe } from 'src/common/pipes/organizer-validation/organizer-updateInfo-validation.pipe';
import { UpdateOrganizerDto } from 'src/common/dto/organizer-dto/update-organizer.dto';
import { PublicEventsQueryDto } from 'src/common/dto/organizer-dto/event-dto/public-events-query.dto';

@UsePipes(
    new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }),
)
@Controller('organizer')
export class OrganizerController {
    constructor(
        private readonly organizerService: OrganizerService,
        private readonly authService: OrganizerAuthService,
    ) { }

    // To get the organizer ID
    private getOrganizerId(req: any): number {
        return Number(req?.user?.sub);
    }
    // REGISTER: POST /organizer/register
    @Post('register')
    @UsePipes(OrganizerValidationPipe)
    async register(@Body() dto: CreateOrganizerDto) {
        return this.authService.register(dto as any);
    }

    // LOGIN: POST /organizer/login  
    @Post('login')
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
    async login(
        @Body() dto: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const result = await this.authService.login(dto);
        setAuthCookie(res, result.access_token);
        return { message: 'Login successful', organizer: result.organizer, access_token: result.access_token };
    }

    // LOGOUT: POST /organizer/logout
    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response) {
        clearAuthCookie(res);
        return { message: 'Logout successful' };
    }


    // EVENTS CRUD
    @UseGuards(JwtAuthGuard)
    @Post('events')
    @UsePipes(EventValidationPipe)
    createEvent(@Body() dto: CreateEventDto, @Req() req: any) {
        console.log("REQ.USER =>", req.user);
        return this.organizerService.createEvent(dto, this.getOrganizerId(req));
    }

    @UseGuards(JwtAuthGuard)
    @Get('events')
    getAllEvents() {
        return this.organizerService.getAllEvents();
    }

    @UseGuards(JwtAuthGuard)
    @Get('events/:eventId')
    getEventById(@Param('eventId', PositiveIntPipe) eventId: number) {
        return this.organizerService.getEventById(eventId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('events/:eventId')
    updateEvent(
        @Param('eventId', PositiveIntPipe) eventId: number,
        @Body() dto: UpdateEventDto,
    ) {
        return this.organizerService.updateEvent(eventId, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('events/:eventId')
    deleteEvent(@Param('eventId', PositiveIntPipe) eventId: number) {
        return this.organizerService.deleteEvent(eventId);
    }

    //Public Events: Landing page events....
    // @Get('events/public')
    // @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    // getPublicEvents(@Query() q: PublicEventsQueryDto) {
    //     return this.organizerService.getPublicEvents(q);
    // }

    // ATTENDEES CRUD
    @UseGuards(JwtAuthGuard)
    @Post('attendees')
    @UsePipes(AttendeeValidationPipe)
    createAttendee(@Body() dto: CreateAttendeeDto, @Req() req: any) {
        return this.organizerService.createAttendee(dto, this.getOrganizerId(req));
    }

    @UseGuards(JwtAuthGuard)
    @Get('attendees')
    getAllAttendees() {
        return this.organizerService.getAllAttendees();
    }

    @UseGuards(JwtAuthGuard)
    @Get('attendees/:attendeeId')
    getAttendeeById(@Param('attendeeId', PositiveIntPipe) attendeeId: number) {
        return this.organizerService.getAttendeeById(attendeeId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('attendees/:attendeeId')
    updateAttendee(
        @Param('attendeeId', PositiveIntPipe) attendeeId: number,
        @Body() dto: UpdateAttendeeDto,
    ) {
        return this.organizerService.updateAttendee(attendeeId, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('attendees/:attendeeId')
    deleteAttendee(@Param('attendeeId', PositiveIntPipe) attendeeId: number) {
        return this.organizerService.deleteAttendee(attendeeId);
    }

    // EVENT <-> ATTENDEE 
    @UseGuards(JwtAuthGuard)
    @Post('events/:eventId/attendees/:attendeeId')
    addAttendeeToEvent(
        @Param('eventId', PositiveIntPipe) eventId: number,
        @Param('attendeeId', PositiveIntPipe) attendeeId: number,
    ) {
        return this.organizerService.addAttendeeToEvent(eventId, attendeeId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('events/:eventId/attendees/:attendeeId')
    removeAttendeeFromEvent(
        @Param('eventId', PositiveIntPipe) eventId: number,
        @Param('attendeeId', PositiveIntPipe) attendeeId: number,
    ) {
        return this.organizerService.removeAttendeeFromEvent(eventId, attendeeId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('events/:eventId/attendees')
    getAttendeesOfEvent(@Param('eventId', PositiveIntPipe) eventId: number) {
        return this.organizerService.getAttendeesOfEvent(eventId);
    }

    // ------------------>>> Organizer Sectio <<<---------------
    // Get profile info of organizer
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Req() req: any) {
        const organizerId = this.getOrganizerId(req);
        return this.organizerService.getProfileById(organizerId);
    }

    //Profile stats (events + attendees counts)
    @UseGuards(JwtAuthGuard)
    @Get('profile/stats')
    getProfileStats(@Req() req: any) {
        const organizerId = this.getOrganizerId(req);
        return this.organizerService.getProfileStats(organizerId);
    }


    // To change organizer Password
    @UseGuards(JwtAuthGuard)
    @Patch('change-password')
    changePassword(
        @Req() req: any,
        @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
        dto: ChangePasswordDto,
    ) {
        const organizerId = this.getOrganizerId(req);
        return this.organizerService.changePassword(organizerId, dto);
    }

    //Update Organizer Info
    @UseGuards(JwtAuthGuard)
    @Patch('update')
    @UsePipes(new UpdateOrganizerValidationPipe())
    updateOrganizer(
        @Req() req,
        @Body() body: UpdateOrganizerDto,
    ) {
        const organizerId = this.getOrganizerId(req);
        return this.organizerService.updateOrganizer(organizerId, body);
    }

    //Delete organizer account (uses JWT logged-in organizer)
    @UseGuards(JwtAuthGuard)
    @Delete('account')
    deleteAccount(@Req() req: any) {
        const organizerId = this.getOrganizerId(req);
        return this.organizerService.deleteOrganizerAccount(organizerId);
    }

    // To test frontend connection
    @Get('test-connection')
    testConnection() {
        return { message: 'Organizer controller connected successfully' }
    }

}
