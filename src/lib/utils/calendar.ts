import type { CalendarEvent } from '$lib/types/calendar';
import {
	HOUR_HEIGHT_REM,
	START_DATETIME,
	END_DATETIME,
	MS_PER_HOUR
} from '$lib/config/calendar';

export interface CalendarDate {
	label: string;
	topOffset: number;
	marginTop: number;
}

const DATE_MARKER_HEIGHT_REM = 2.5;

export interface HourMarker {
	label: string;
	topOffset: number;
}

export function getCalendarHeight(): number {
	const startDate = new Date(START_DATETIME);
	const endDate = new Date(END_DATETIME);

	const hoursFromStart = (endDate.getTime() - startDate.getTime()) / MS_PER_HOUR;

	let dayBoundaries = 0;
	const current = new Date(startDate);
	current.setHours(0, 0, 0, 0);
	current.setDate(current.getDate() + 1);
	while (current <= endDate) {
		dayBoundaries++;
		current.setDate(current.getDate() + 1);
	}

	return (
		HOUR_HEIGHT_REM +
		hoursFromStart * HOUR_HEIGHT_REM +
		dayBoundaries * 1.2 * HOUR_HEIGHT_REM +
		HOUR_HEIGHT_REM
	);
}

export function getHourMarkers(): HourMarker[] {
	const markers: HourMarker[] = [];
	const startDate = new Date(START_DATETIME);
	const endDate = new Date(END_DATETIME);

	const current = new Date(startDate);
	const startsOnHour = startDate.getMinutes() === 0 && startDate.getSeconds() === 0;
	current.setMinutes(0, 0, 0);
	if (!startsOnHour) {
		current.setHours(current.getHours() + 1);
	}

	let dayBoundariesCrossed = 0;
	let prevDay = startDate.getDate();

	while (current <= endDate) {
		const currentDay = current.getDate();
		if (currentDay !== prevDay) {
			dayBoundariesCrossed++;
			prevDay = currentDay;
		}

		const hoursFromStart = (current.getTime() - startDate.getTime()) / (1000 * 60 * 60);
		const topOffset =
			HOUR_HEIGHT_REM +
			hoursFromStart * HOUR_HEIGHT_REM +
			dayBoundariesCrossed * 1.2 * HOUR_HEIGHT_REM;

		const hour = current.getHours();
		const label =
			hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`;

		markers.push({ label, topOffset });

		current.setHours(current.getHours() + 1);
	}

	return markers;
}

export function getCalendarDates(): CalendarDate[] {
	const dates: CalendarDate[] = [];
	const startDate = new Date(START_DATETIME);
	const endDate = new Date(END_DATETIME);

	const current = new Date(startDate);
	current.setHours(0, 0, 0, 0);

	const endDay = new Date(endDate);
	endDay.setHours(0, 0, 0, 0);

	let dayIndex = 0;
	let prevTopOffset = 0;

	while (current <= endDay) {
		let topOffset: number;
		let marginTop: number;

		if (dayIndex === 0) {
			topOffset = 0;
			marginTop = 0;
		} else {
			const midnight = new Date(current);
			const hoursFromStart = (midnight.getTime() - startDate.getTime()) / MS_PER_HOUR;
			const midnightOffset =
				HOUR_HEIGHT_REM +
				hoursFromStart * HOUR_HEIGHT_REM +
				dayIndex * 1.2 * HOUR_HEIGHT_REM;
			topOffset = midnightOffset - HOUR_HEIGHT_REM;
			marginTop = topOffset - prevTopOffset - DATE_MARKER_HEIGHT_REM;
		}

		dates.push({
			label: current.toLocaleDateString('en-US', {
				weekday: 'short',
				month: 'short',
				day: 'numeric'
			}),
			topOffset,
			marginTop
		});

		prevTopOffset = topOffset;
		current.setDate(current.getDate() + 1);
		dayIndex++;
	}

	return dates;
}

function toDate(dateTime: string): Date {
	return new Date(dateTime);
}

function getDurationHours(startISO: string, endISO: string): number {
	const start = toDate(startISO);
	const end = toDate(endISO);
	return (end.getTime() - start.getTime()) / MS_PER_HOUR;
}

function getLocalMidnight(date: Date): Date {
	const midnight = new Date(date);
	midnight.setHours(24, 0, 0, 0);
	return midnight;
}

function countDayBoundaries(fromISO: string, toISO: string): number {
	const from = toDate(fromISO);
	const to = toDate(toISO);

	if (to <= from) return 0;

	let count = 0;
	let currentMidnight = getLocalMidnight(from);

	while (currentMidnight <= to) {
		count++;
		currentMidnight = getLocalMidnight(currentMidnight);
	}

	return count;
}

export function getEventHeight(event: CalendarEvent): number {
	if (event.isAllDay) return 0;

	let durationHours = getDurationHours(event.start, event.end);
	if (durationHours < 0) durationHours = 0;

	const dayBoundaries = countDayBoundaries(event.start, event.end);

	const baseHeightRem = durationHours * HOUR_HEIGHT_REM;
	const separationHeightRem = dayBoundaries * 1.2 * HOUR_HEIGHT_REM;

	return baseHeightRem + separationHeightRem;
}

export function getEventOffset(event: CalendarEvent): number {
	if (event.isAllDay) return 0;

	const calendarStart = toDate(START_DATETIME);
	const eventStart = toDate(event.start);

	if (eventStart <= calendarStart) {
		return 0;
	}

	const hoursFromStart = (eventStart.getTime() - calendarStart.getTime()) / MS_PER_HOUR;
	const baseOffsetRem = HOUR_HEIGHT_REM + hoursFromStart * HOUR_HEIGHT_REM;

	const dayBoundaries = countDayBoundaries(START_DATETIME, event.start);
	const separationOffsetRem = dayBoundaries * 1.2 * HOUR_HEIGHT_REM;

	return baseOffsetRem + separationOffsetRem;
}

export function isEventNow(event: CalendarEvent): boolean {
	const now = new Date();
	const start = new Date(event.start);
	const end = new Date(event.end);
	return now >= start && now <= end;
}

export function isEventUpcoming(event: CalendarEvent): boolean {
	const now = new Date();
	const start = new Date(event.start);
	return start > now;
}

export function isEventPast(event: CalendarEvent): boolean {
	const now = new Date();
	const end = new Date(event.end);
	return end < now;
}

export function getEventDuration(event: CalendarEvent): number {
	const start = new Date(event.start);
	const end = new Date(event.end);
	return end.getTime() - start.getTime();
}

export function getEventDurationMinutes(event: CalendarEvent): number {
	return Math.round(getEventDuration(event) / (1000 * 60));
}

export function getEventDurationHours(event: CalendarEvent): number {
	return Math.round(getEventDuration(event) / (1000 * 60 * 60));
}

export function formatEventTime(event: CalendarEvent): string {
	if (event.isAllDay) {
		return 'All day';
	}

	const start = new Date(event.start);
	const end = new Date(event.end);

	const timeFormat: Intl.DateTimeFormatOptions = {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true
	};

	return `${start.toLocaleTimeString('en-US', timeFormat)} - ${end.toLocaleTimeString('en-US', timeFormat)}`;
}

export function formatEventDate(event: CalendarEvent): string {
	const start = new Date(event.start);

	return start.toLocaleDateString('en-US', {
		weekday: 'short',
		month: 'short',
		day: 'numeric'
	});
}

export function groupEventsByDate(events: CalendarEvent[]): Map<string, CalendarEvent[]> {
	const grouped = new Map<string, CalendarEvent[]>();

	for (const event of events) {
		const date = new Date(event.start).toDateString();
		const existing = grouped.get(date) ?? [];
		existing.push(event);
		grouped.set(date, existing);
	}

	return grouped;
}

export function getEventsForDate(events: CalendarEvent[], date: Date): CalendarEvent[] {
	const targetDate = date.toDateString();
	return events.filter((event) => new Date(event.start).toDateString() === targetDate);
}

export function getNextEvent(events: CalendarEvent[]): CalendarEvent | null {
	const now = new Date();
	return events.find((event) => new Date(event.start) > now) ?? null;
}

export function getCurrentEvent(events: CalendarEvent[]): CalendarEvent | null {
	return events.find(isEventNow) ?? null;
}
