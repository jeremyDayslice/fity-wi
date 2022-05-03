<script context="module">
	export async function load({ params }) {
		const game = await findGame(params.code);
		return {
			props: {
				game,
			},
		};
	}
</script>

<script lang="ts">
	import { findGame } from '$lib/games/games.api';
	import { codeStore, join, playerStore, roleStore } from '$lib/games/games.store';
	import { Roles } from '$lib/games/games.types';
	import QuestionDisplay from '$lib/QuestionDisplay.svelte';
	import questionsSocket from '$lib/questions/questions.socket';
	import questionsStore from '$lib/questions/questions.store';
	import { onMount } from 'svelte';

	export let game: { code: string; players: any };
	debugger;

	$: if ($playerStore) {
		join.rejoinGame($playerStore.id, $playerStore.name, game.code);
	}
	onMount(() => {
		if ($roleStore && $roleStore == Roles.HOST) {
			console.log('I am host');
			questionsSocket.question.listenForGuessResult($codeStore);
		} else {
			questionsSocket.question.listenForGuess($codeStore);
		}
	});

	const handleStart = () => {
		questionsSocket.question.newQuestion(game.code);
	};
</script>

<div class="flex">
	<div class="text-gray-400 text-sm text-right">
		{game.code}
	</div>
	{#if $questionsStore}
		<QuestionDisplay />
	{/if}
</div>

<h2>Currently in the hot seat is {game.player}</h2>

{#if $roleStore == Roles.HOST}
	<button class="p-6 bg-blue-500 text-white" on:click={handleStart} type="button"> Start </button>
{/if}

<style lang="postcss">
	.answer {
		@apply bg-green-100;
	}
</style>
