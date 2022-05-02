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
	import gamesSocket from '$lib/games/games.socket';
	import { codeStore, roleStore } from '$lib/games/games.store';
	import { Roles } from '$lib/games/games.types';
	import questionsSocket from '$lib/questions/questions.socket';
	import questionsStore from '$lib/questions/questions.store';

	export let game: { code: string; player: string };
	let checker: string = '';
	let question = {
		question: null,
		choices: [],
	};
	let answer: number = -1;
	let guess: number = -1;

	if ($roleStore && $roleStore == Roles.HOST) {
		console.log('I am host');
		questionsSocket.question.listenForGuessResult($codeStore);
	}
	questionsSocket.question.listenForGuess($codeStore);

	const handleJoin = () => {
		gamesSocket.join.joinAsChecker(checker, game.code);
	};
	const handleStart = () => {
		questionsSocket.question.newQuestion(game.code);
	};

	const makeGuess = (idx: number) => {
		questionsSocket.question.makeGuess(game.code, question.choices[idx]);
	};
</script>

<div class="flex">
	<div class="text-gray-400 text-sm text-right">
		{game.code}
	</div>
	{#if $questionsStore}
		<div class="bg-white rounded-lg p-10">
			<span class="text-xl font-semibold">
				{$questionsStore.question}
			</span>
			<div class="flex">
				{#each $questionsStore.choices as choice, i}
					<button
						type="button"
						class:answer={i == answer}
						on:click={() => makeGuess(i)}
						class="w-1/2 border-2 border-purple-500">{choice}</button
					>
				{/each}
			</div>
		</div>
	{/if}
</div>

<h2>Currently in the hot seat is {game.player}</h2>

<input bind:value={checker} />
<button on:click={handleJoin} type="button"> Join as a Checker </button>
<button class="p-6 bg-blue-500 text-white" on:click={handleStart} type="button"> Start </button>
{#if $roleStore == Roles.HOST}
	<button class="p-6 bg-blue-500 text-white" on:click={handleStart} type="button"> Start </button>
{/if}

<style lang="postcss">
	.answer {
		@apply bg-green-100;
	}
</style>
