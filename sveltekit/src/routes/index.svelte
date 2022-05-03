<script lang="ts">
	import { goto } from '$app/navigation';

	import { codeStore, join, playerStore } from '$lib/games/games.store';

	let name: string = '';
	let code: string = '';

	const handleOnClick = async () => {
		debugger;
		if (!$playerStore) {
			playerStore.makePlayer(name);
		}
		await join.hostGame($playerStore.id, $playerStore.name);
		goto(`/${$codeStore}`);
	};

	const handleJoin = async () => {
		if (!$playerStore) {
			playerStore.makePlayer(name);
		}
		await join.joinGameAsChecker($playerStore.id, $playerStore.name, code);
		goto(`/${$codeStore}`);
	};
</script>

<h1 class="text-2xl text-blue-400">Welcome to Fake It Til Ya Win It</h1>
{#if !$playerStore}
	What is your name?
	<input bind:value={name} />
{/if}
<button type="button" on:click={handleOnClick}>Make Game</button>

or

<input bind:value={code} />
<button on:click={handleJoin} type="button"> Join as a Checker </button>
