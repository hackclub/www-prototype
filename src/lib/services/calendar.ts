import { google, type calendar_v3 } from 'googleapis';
import { GOOGLE_CALENDAR_API_KEY, GOOGLE_CALENDAR_ID } from '$env/static/private';
import type { CalendarEvent } from '$lib/types/calendar';

const calendar = google.calendar({
	version: 'v3',
	auth: GOOGLE_CALENDAR_API_KEY
});

const COLOR_MAP: Record<string, string> = {
	'1': '#7986cb',
	'2': '#33b679',
	'3': '#8e24aa',
	'4': '#e67c73',
	'5': '#f6bf26',
	'6': '#f4511e',
	'7': '#039be5',
	'8': '#616161',
	'9': '#3f51b5',
	'10': '#0b8043',
	'11': '#d50000'
};

const DEFAULT_COLOR = '#4285f4';

function transformEvent(event: calendar_v3.Schema$Event): CalendarEvent {
	const isAllDay = !event.start?.dateTime;

	return {
		id: event.id ?? '',
		name: event.summary ?? '',
		description: event.description ?? null,
		location: event.location ?? null,
		color: event.colorId ? (COLOR_MAP[event.colorId] ?? DEFAULT_COLOR) : DEFAULT_COLOR,
		start: event.start?.dateTime ?? event.start?.date ?? '',
		end: event.end?.dateTime ?? event.end?.date ?? '',
		isAllDay
	};
}

export interface GetEventsOptions {
	timeMin?: Date;
	timeMax?: Date;
	maxResults?: number;
}

export async function getEvents(options: GetEventsOptions = {}): Promise<CalendarEvent[]> {
	const { timeMin = new Date(), timeMax, maxResults = 50 } = options;

	const response = await calendar.events.list({
		calendarId: GOOGLE_CALENDAR_ID,
		timeMin: timeMin.toISOString(),
		timeMax: timeMax?.toISOString(),
		maxResults,
		singleEvents: true,
		orderBy: 'startTime'
	});

	return (response.data.items ?? []).map(transformEvent);
}
