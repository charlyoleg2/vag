<script lang="ts">
	//import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import appPackage from '../../package.json';
	let currDir = 'unknown';
	onMount(async () => {
		try {
			const res = await fetch('/api/currDir');
			if (res.ok) {
				currDir = await res.text();
			} else {
				throw `err312: fetch response status ${res.status}`;
			}
		} catch (err) {
			console.log(`err621: error while fetching /api/currDir`);
			console.log(err);
		}
	});
</script>

<header>
	<h1>Vag webUI</h1>
	<span>running in the directory : {currDir}</span>
</header>
<main>
	<slot />
</main>
<footer>
	<article>
		<ol>
			<li><a href="https://charlyoleg2.github.io/vag">homepage</a></li>
			<li><a href="https://www.npmjs.com/package/vag_tools">npm-package</a></li>
			<li><a href="https://github.com/charlyoleg2/vag">sources</a></li>
		</ol>
	</article>
	<article>
		<h6>Examples</h6>
		<ol>
			<li>
				<a href="https://github.com/charlyoleg2/parametrix_vag">parametrix_vag</a>
			</li>
		</ol>
	</article>
	<article>
		<pre>
npm package:
	name: {appPackage.name}
	version : {appPackage.version}
		</pre>
	</article>
</footer>

<style lang="scss">
	:global(body) {
		font-family: 'Courier New', 'Helvetica', 'Arial', 'Verdana';
		margin: 0;
		background-color: DarkCyan;
	}
	header {
		margin: 1rem;
	}
	h1 {
		color: aquamarine;
		margin: 1rem;
		margin-bottom: 0.2rem;
	}
	main {
		background-color: GhostWhite;
		min-height: 70vh;
		padding: 1rem;
		padding-top: 2rem;
		padding-bottom: 3rem;
	}
	footer {
		margin: 1rem;
		margin-top: 2rem;
		margin-bottom: 5rem;
	}
</style>
