<script lang="ts">
	import type { CalendarEvent } from '$lib/types/calendar';
	import {
		getEventOffset,
		getEventHeight,
		formatEventTime,
		getEventDurationMinutes
	} from '$lib/utils/calendar';
	import { NUM_COLUMNS } from '$lib/config/calendar';
	import EventModal from './EventModal.svelte';

	interface Props {
		event: CalendarEvent;
		column?: number;
	}

	const { event, column = 0 }: Props = $props();

	let showModal = $state(false);

	const topOffset = $derived(getEventOffset(event));
	const height = $derived(getEventHeight(event));
	const durationMinutes = $derived(getEventDurationMinutes(event));
	const isVeryShort = $derived(durationMinutes < 30);
	const isShort = $derived(durationMinutes >= 30 && durationMinutes < 45);
	const locationOnNewLine = $derived(durationMinutes >= 45);

	const OVERLAP = 0.3;
</script>

<div
	class="event absolute rounded px-3 shadow shadow-black/50 leading-5 cursor-pointer {isVeryShort ||
	isShort
		? 'py-0 flex flex-col justify-center'
		: 'py-2'}"
	onclick={() => (showModal = true)}
	onkeydown={(e) => e.key === 'Enter' && (showModal = true)}
	role="button"
	tabindex="0"
	style="
		--col: {column};
		--cols: {NUM_COLUMNS};
		--overlap: {OVERLAP};
		background-color: {event.color};
		top: calc({topOffset}rem + 1px);
		height: calc({height}rem - 2px);
	"
>
	{#if isVeryShort}
		<p class="truncate">
			<span class="font-bold">{event.name}</span>,
			<span class="text-sm"
				>{formatEventTime(event)}{#if event.location}, {event.location}{/if}</span
			>
		</p>
	{:else}
		<p class="font-bold">{event.name}</p>
		<p class="text-sm leading-4">
			{formatEventTime(event)}{#if event.location && !locationOnNewLine}, {event.location}{/if}
		</p>
		{#if event.location && locationOnNewLine}
			<p class="text-sm leading-4">{event.location}</p>
		{/if}
	{/if}
</div>

{#if showModal}
	<EventModal {event} onClose={() => (showModal = false)} />
{/if}

<style>
	.event {
		--left-offset: 4.5rem;
		--right-offset: 1.5rem;
		--available-width: calc(100% - var(--left-offset) - var(--right-offset));

		left: var(--left-offset);

		/*
		 * Column width formula:
		 * w = availableWidth / (1 + (1 - overlap) * (cols - 1))
		 */
		--columnWidth: calc(var(--available-width) / (1 + (1 - var(--overlap)) * (var(--cols) - 1)));

		width: var(--columnWidth);

		/*
		 * Position via transform:
		 * translateX(col * (1 - overlap) * 100%)
		 * 100% here refers to the element's own width
		 */
		transform: translateX(calc(var(--col) * (1 - var(--overlap)) * 100%));
	}

	.event::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 4px;
		background-color: rgba(255, 255, 255, 0.3);
		border-radius: 0.375rem 0 0 0.375rem;
	}
</style>
