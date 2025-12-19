<script lang="ts">
	import { browser } from '$app/environment';
	import {
		getCalendarDates,
		getHourMarkers,
		getCalendarHeight,
		assignEventColumns
	} from '$lib/utils/calendar';
	import type { CalendarEvent } from '$lib/types/calendar';
	import Event from './Event.svelte';

	const dates = getCalendarDates();
	const hourMarkers = getHourMarkers();
	const calendarHeight = getCalendarHeight();

	let events = $state<CalendarEvent[]>([]);
	const eventsWithColumns = $derived(assignEventColumns(events));

	$effect(() => {
		if (!browser) return;

		(async () => {
			const response = await fetch('/api/calendar');
			const data = await response.json();
			events = data.events ?? [];
		})();
	});
</script>

<div class="bg-pt-dark overflow-y-scroll relative h-128">
	{#each hourMarkers as marker, i}
		<div
			class="absolute flex items-center left-6 right-6 opacity-50 text-sm space-x-2 -translate-y-1/2"
			style="top: {marker.topOffset}rem{i === hourMarkers.length - 1 ? '; visibility: hidden' : ''}"
		>
			<p class="w-10 text-right">{marker.label}</p>
			<div class="border-b border-white grow"></div>
		</div>
	{/each}
	{#each dates as date, i}
		<div
			class="sticky left-0 right-0 bg-pt-lighter text-xl py-1 px-4 flex justify-between z-10"
			style="top: 0; margin-top: {date.marginTop}rem"
		>
			<p>{date.label}</p>
			<p>Day {i + 1}</p>
		</div>
	{/each}
	{#each eventsWithColumns as { event, column } (event.id)}
		<Event {event} {column} />
	{/each}
</div>

<style>
</style>
