<script lang="ts">
	import { getCalendarDates, getHourMarkers, getCalendarHeight } from '$lib/utils/calendar';

	const dates = getCalendarDates();
	const hourMarkers = getHourMarkers();
	const calendarHeight = getCalendarHeight();
</script>

<div class="bg-pt-dark overflow-y-scroll relative h-128">
	{#each hourMarkers as marker, i}
		<div
			class="absolute flex items-center left-6 right-6 opacity-50 text-sm space-x-2"
			style="top: {marker.topOffset}rem{i === hourMarkers.length - 1 ? '; visibility: hidden' : ''}"
		>
			<p>{marker.label}</p>
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
</div>

<style>
</style>
