<script lang="ts">
	//import { base } from '$app/paths';

	let lastTask = '0';
	function doTask(tid: number) {
		lastTask = `task-${tid}`;
	}
</script>

<h1>Trigger a sequence of tasks</h1>
<p><button on:click={() => doTask(1)}>task-1</button></p>
<p><button on:click={() => doTask(2)}>task-2</button></p>
<p><button on:click={() => doTask(3)}>task-3</button></p>

<h6>last task</h6>
<p>{lastTask}</p>

<style lang="scss">
	button {
		padding: 1rem;
		background-color: lightBlue;
		color: blue;
	}
</style>
