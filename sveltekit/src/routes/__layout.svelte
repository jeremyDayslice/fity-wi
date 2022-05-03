<script>
	import '$lib/../app.postcss';
	import { playerStore } from '$lib/games/games.store';
	import { onMount } from 'svelte';

	onMount(async () => {
		await playerStore.loadPlayer();
	});
</script>

<slot />
