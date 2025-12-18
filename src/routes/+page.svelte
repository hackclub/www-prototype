<script lang="ts">
	import Calendar from '$lib/components/Calendar.svelte';
	import { CALENDAR_TIMEZONE_DISPLAY } from '$lib/config/calendar';
</script>

<svelte:head>
	<title>Prototype: Event Information</title>
	<meta name="description" content="Dec 19-21, San Jose" />
	<link rel="icon" type="image/webp" href="/icon.webp" />
</svelte:head>

<div class="border-b-2 pb-4 flex justify-between items-center mb-12">
	<div class="flex font-rc text-3xl items-center space-x-8">
		<img src="prototype_simple.webp" alt="Prototype Logo" class="h-12" />
		<p>Event<br />Information</p>
	</div>
	<div class="text-2xl text-right">
		Need to reach us urgently?<br />Call
		<a href="tel:1-855-625-4225" class="underline">855-625-4225</a>
	</div>
</div>

<div class="border-2 text-2xl p-4 w-full text-center bg-pt-dark mb-12 flex flex-col">
	<p>The event takes place at Guildhouse, San Jose</p>
	<a href="https://maps.app.goo.gl/fHFQBWknh9nsrHtY7" target="_blank" class="underline">
		420 S First St, San Jose, CA 95113
	</a>
	<p class="mt-4">Please show up before 3 PM</p>
</div>

<div class="space-y-4">
	<div>
		<p class="text-4xl font-rc">Schedule</p>
	</div>
	<div class="w-full flex flex-col space-y-2">
		<Calendar />
		<p>Events shown in time zone: {CALENDAR_TIMEZONE_DISPLAY}</p>
	</div>
</div>
