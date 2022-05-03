<script type="ts">
	import { codeStore } from './games/games.store';

	import questionsSocket from './questions/questions.socket';
	import questionsStore from './questions/questions.store';
	import responseStore from './response/response.store';

	const handleClick = (guess: string) => {
		console.log($codeStore);
		questionsSocket.question.makeGuess($codeStore, guess);
	};
</script>

<div class="w-full px-12 flex flex-col">
	<h1 class="text-3xl font-semibold text-gray-800">
		{$questionsStore.question}
	</h1>
	<div class="flex w-full gap-6 ">
		{#each $questionsStore.choices as choice}
			<button
				on:click={() => handleClick(choice)}
				type="button"
				class="w-full md:w-1/2 px-8 py-12 rounded-xl border border-slate-500 text-center align-middle"
				class:right={$responseStore && $responseStore.answer && choice == $responseStore.answer}
				class:wrong={$responseStore &&
					choice == $responseStore.guess &&
					$responseStore.answer &&
					$responseStore.guess != $responseStore.answer}
				class:selected={$responseStore && choice == $responseStore.guess && !$responseStore.answer}
			>
				{choice}
			</button>
		{/each}
	</div>
</div>

<style lang="postcss">
	.selected {
		@apply bg-yellow-400 text-gray-800 border-yellow-600;
	}

	.right {
		@apply bg-green-400 text-gray-800 border-green-600;
	}

	.wrong {
		@apply bg-red-400 text-gray-800 border-red-600;
	}
</style>
