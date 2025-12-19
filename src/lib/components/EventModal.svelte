<script lang="ts">
	import type { CalendarEvent } from '$lib/types/calendar';
	import { formatEventTime } from '$lib/utils/calendar';

	interface Props {
		event: CalendarEvent;
		onClose: () => void;
	}

	const { event, onClose }: Props = $props();

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			onClose();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onClose();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div
	class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
	onclick={handleBackdropClick}
	onkeydown={(e) => e.key === 'Escape' && onClose()}
	role="dialog"
	aria-modal="true"
	tabindex="-1"
>
	<div
		class="rounded-lg py-3 px-5 max-w-lg w-full shadow-xl relative overflow-hidden"
		style="background-color: {event.color}"
	>
		<button
			class="absolute top-2 right-3 text-white/70 hover:text-white text-2xl leading-none"
			onclick={onClose}
			aria-label="Close modal"
		>
			×
		</button>

		<div class="absolute left-0 bottom-0 top-0 w-2 bg-white/20"></div>

		<p class="text-xl font-bold pr-8 leading-6">{event.name}</p>
		<p class="leading-5">
			{formatEventTime(event)}
		</p>
		{#if event.location && event.description}
			<p class="leading-5">{event.location}</p>
		{/if}

		{#if event.description}
			<p class="mt-4 opacity-90">{event.description}</p>
		{/if}
	</div>
</div>
