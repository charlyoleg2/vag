<script lang="ts">
	//import { base } from '$app/paths';
	import appPackage from '../../package.json';
	const currDir = '/home/abc';
</script>

<header>
	<h1>Vag webUI</h1>
	<span>running in the directory {currDir}</span>
</header>
<main>
	<slot />
</main>
<footer>
	<article>
		<ol>
			<li><a href="https://charlyoleg2.github.io/vag">homepage</a></li>
			<li><a href="https://www.npmjs.com/package/vag">npm-package</a></li>
			<li><a href="https://github.com/charlyoleg2/vag">sources</a></li>
			<li>
				<a href="https://github.com/charlyoleg2/parametrix_vag"
					>parametrix_vag, an example</a
				>
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
		margin-top: 5rem;
		margin-bottom: 5rem;
	}
	h1 {
		color: aquamarine;
		margin: 1rem;
		margin-bottom: 0.2rem;
	}
	main {
		background-color: GhostWhite;
		min-height: 70vh;
		padding-top: 2rem;
		padding-bottom: 3rem;
	}
	footer {
		margin: 1rem;
		margin-top: 5rem;
		margin-bottom: 5rem;
	}
</style>
