export interface CalendarEvent {
	id: string;
	name: string;
	description: string | null;
	location: string | null;
	color: string;
	start: string;
	end: string;
	isAllDay: boolean;
}
