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
	import games from '$lib/games/games.store';

	import { io, Socket } from 'socket.io-client';
	const socket: Socket = io('http://localhost:3001', { transports: ['websocket'] });
	export let game: { code: string; player: string };
	let checker: string = '';
	let question = {
		question: null,
		choices: [],
	};
	let answer: number = -1;
	let guess: number = -1;

	socket.on('updated', (game) => {
		console.log('server update ', game);
		game = game;
	});

	socket.on('newQuestion', (q) => {
		question = q;
		debugger;
	});

	if ($games.code && $games.code == game.code) {
		socket.emit('joinAsHost', { name: checker, code: game.code });

		socket.on('host-updated', (game) => {
			console.log('host update ', game);
			game = game;
		});

		socket.on('newAnswer', (a) => (answer = a));
	}
	socket.on('guess-made', (answer: number, guess: number) => {
		answer = answer;
		guess = guess;
		console.log('Got it ', answer, guess);
	});

	const handleJoin = () => {
		socket.emit('joinAsChecker', { name: checker, code: game.code });
	};
	const handleStart = () => {
		socket.emit('nextQuestion', { code: game.code });
	};

	const makeGuess = (idx: number) => {
		socket.emit('guess', { code: game.code, guess: idx });
	};
</script>

<div class="flex">
	<div class="text-gray-400 text-sm text-right">
		{game.code}
	</div>
	<div class="bg-white rounded-lg p-10">
		<span class="text-xl font-semibold">
			{question.question}
		</span>
		<div class="flex">
			{#each question.choices as choice, i}
				<button
					type="button"
					class:answer={i == answer}
					on:click={() => makeGuess(i)}
					class="w-1/2 border-2 border-purple-500">{choice}</button
				>
			{/each}
		</div>
	</div>
</div>

<h2>Currently in the hot seat is {game.player}</h2>

<input bind:value={checker} />
<button on:click={handleJoin} type="button"> Join as a Checker </button>
{#if $games.code == game.code}
	<button class="p-6 bg-blue-500 text-white" on:click={handleStart} type="button"> Start </button>
{/if}

<style lang="postcss">
	.answer {
		@apply bg-green-100;
	}
</style>
