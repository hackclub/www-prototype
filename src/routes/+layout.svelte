<script lang="ts">
	import './app.css';

	let { children } = $props();
</script>

<div
	class="grainy-bg relative min-h-dvh md:min-h-screen"
	style="background-color: #6D1010; background-image: linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px); background-size: 50px 50px; background-repeat: repeat;"
>
	<main class="max-w-6xl mx-auto px-6 py-16">
		{@render children()}
	</main>
</div>
