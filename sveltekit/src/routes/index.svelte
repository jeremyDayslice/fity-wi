<script lang="ts">
	import { goto } from '$app/navigation';

	import { codeStore, join } from '$lib/games/games.store';

	let name: string = '';
	const handleOnClick = async () => {
		await join.hostGame(name);
		goto(`/${$codeStore}`);
	};
</script>

<h1 class="text-2xl text-blue-400">Welcome to Fake It Til Ya Win It</h1>

<input bind:value={name} />
<button type="button" on:click={handleOnClick}>Make Game</button>
