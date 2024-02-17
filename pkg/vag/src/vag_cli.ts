#!/usr/bin/env node
// vag_cli.ts

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { Vag } from './vag_core';

//await repos.d_custom('status');
//await repos.d_custom('status', true);
//await repos.d_export_yaml('tmp/exported_repos_1.yml');
//await repos.d_export_yaml('tmp/exported_repos_2.yml', true);
//const validation_result = await repos.validate_yaml('tests/test_repos_3.yml');
const cmd = {
	list: false,
	clone: false,
	checkout: false,
	verify: false,
	fetch: false,
	pull: false,
	push: false,
	branch: false,
	status: false,
	diff: false,
	log: false,
	remote: false,
	stash_list: false,
	clean: false,
	custom: false,
	export_yaml: false,
	validate_yaml: false,
	versions: false
};

const argv = yargs(hideBin(process.argv))
	.scriptName('vag')
	.usage('Usage: $0 <global-options> command <command-options>')
	.example([
		[
			'$0 clone --importYaml repos.yml --importDir subRepos',
			'clone the git-repos listed in repos.yml in the directory subRepos'
		],
		[
			'$0 status --discoverDir=subRepos',
			'show the status of all discovered git-repos with the directory subRepos'
		],
		[
			"$0 custom --git_command 'log -u -n1'",
			'apply the cutom-command git-log to all discovered git-repos'
		],
		[
			'$0 export_yaml --yaml_path=myRepos.yml --commit_version=true',
			'export the discovered git-repos in the yaml-file myRepos.yml'
		]
	])
	.option('discoverDir', {
		alias: 'd',
		type: 'string',
		description: 'directory-path for searching git-repositories.',
		default: '.'
	})
	.option('deepSearch', {
		alias: 'D',
		type: 'boolean',
		description: 'search further for git-repos within found git-repos.',
		default: true
	})
	.option('importYaml', {
		alias: 'y',
		type: 'string',
		description: 'path to the yaml-file containing the list of repos.',
		default: ''
	})
	.option('importDir', {
		alias: 'b',
		type: 'string',
		description:
			'path to the directory where to clone the repos. If not specified, the directory of the yaml-file is used.',
		default: ''
	})
	.option('only_configured', {
		alias: 'c',
		type: 'boolean',
		description: 'not on all discovered git-repos but only if in importYaml',
		default: false
	})
	.command('list', 'print the lists of git-repositories', {}, () => {
		cmd.list = true;
	})
	.command('clone', 'clone the git-repositories listed in the importYaml file', {}, () => {
		cmd.clone = true;
	})
	.command('checkout', 'checkout the git-repos according to the importYaml file', {}, () => {
		cmd.checkout = true;
	})
	.command('verify', 'verify if the discovered git-repos fit with the importYaml', {}, () => {
		cmd.verify = true;
	})
	.command('fetch', 'git fetch --prune the discovered git-repositories', {}, () => {
		cmd.fetch = true;
	})
	.command('pull', 'pull the discovered git-repositories', {}, () => {
		cmd.pull = true;
	})
	.command('push', 'push the discovered git-repositories', {}, () => {
		cmd.push = true;
	})
	.command('branch', 'show branch of the discovered git-repositories', {}, () => {
		cmd.branch = true;
	})
	.command('status', 'show status of the discovered git-repositories', {}, () => {
		cmd.status = true;
	})
	.command('diff', 'show diff of the discovered git-repositories', {}, () => {
		cmd.diff = true;
	})
	.command('log', 'show log of the discovered git-repositories', {}, () => {
		cmd.log = true;
	})
	.command('remote', 'show remote of the discovered git-repositories', {}, () => {
		cmd.remote = true;
	})
	.command('stash_list', 'show stash_list of the discovered git-repositories', {}, () => {
		cmd.stash_list = true;
	})
	.command('clean', 'git clean -dxf of the discovered git-repositories', {}, () => {
		cmd.clean = true;
	})
	.command(
		'custom',
		'git custom command for each of the discovered git-repos',
		{
			git_command: {
				type: 'string',
				description: 'the git-command to be apply',
				demandOption: true
			}
		},
		() => {
			cmd.custom = true;
		}
	)
	.command(
		'export_yaml',
		'export the discovered git-repositories in a yaml-file',
		{
			yaml_path: {
				type: 'string',
				description: 'the path to the output yaml-file',
				demandOption: true
			},
			commit_version: {
				type: 'boolean',
				description: 'Use commit-hash instead of branch-name for version',
				default: false
			}
		},
		() => {
			cmd.export_yaml = true;
		}
	)
	.command(
		'validate_yaml',
		'validate the syntax of a yaml-file',
		{
			yaml_path: {
				type: 'string',
				description: 'the path to the output yaml-file',
				demandOption: true
			}
		},
		() => {
			cmd.validate_yaml = true;
		}
	)
	.command('versions', 'print the versions of vag', {}, () => {
		cmd.versions = true;
	})
	.strict()
	.parseSync();
//console.log(argv.discoverDir);
//console.log(argv);

//console.log("Hello from vag-cli.ts!");

//console.log(argv.discoverDir);
//console.log(argv.deepSearch);
//console.log(argv.importYaml);
//console.log(argv.importDir);
const vag = new Vag(argv.discoverDir, argv.deepSearch, argv.importYaml, argv.importDir);
await vag.init();

function display_repo_list(repos: string[]): void {
	for (const [idx, repo] of repos.entries()) {
		console.log(`  ${idx + 1} : ${repo}`);
	}
}

if (cmd.list) {
	const d_list = vag.d_list();
	const c_list = vag.c_list();
	const cd_list = vag.cd_list();
	const dnc_list = vag.dnc_list();
	const cnd_list = vag.cnd_list();
	console.log(`List-D : ${d_list.length} discovered git-repositories`);
	display_repo_list(d_list);
	console.log(`List-C : ${c_list.length} configured git-repositories`);
	display_repo_list(c_list);
	console.log(`List-CD : ${cd_list.length} configured and discovered git-repositories`);
	display_repo_list(cd_list);
	console.log(`List-DnC : ${dnc_list.length} discovered git-repositories but not configured`);
	display_repo_list(dnc_list);
	console.log(`List-CnD : ${cnd_list.length} configured git-repositories but not discovered`);
	display_repo_list(cnd_list);
}

if (cmd.clone) {
	await vag.c_clone();
}
if (cmd.checkout) {
	await vag.cd_checkout();
}
if (cmd.verify) {
	await vag.cd_verify();
}
if (cmd.fetch) {
	await vag.d_fetch(argv.only_configured);
}
if (cmd.pull) {
	await vag.d_pull(argv.only_configured);
}
if (cmd.push) {
	await vag.d_push(argv.only_configured);
}
if (cmd.branch) {
	await vag.d_branch(argv.only_configured);
}
if (cmd.status) {
	await vag.d_status(argv.only_configured);
}
if (cmd.diff) {
	await vag.d_diff(argv.only_configured);
}
if (cmd.log) {
	await vag.d_log(argv.only_configured);
}
if (cmd.remote) {
	await vag.d_remote(argv.only_configured);
}
if (cmd.stash_list) {
	await vag.d_stash_list(argv.only_configured);
}
if (cmd.clean) {
	await vag.d_clean(argv.only_configured);
}
if (cmd.custom) {
	await vag.d_custom(argv.git_command as string, argv.only_configured);
}
if (cmd.export_yaml) {
	await vag.d_export_yaml(argv.yaml_path as string, argv.commit_version as boolean);
}
if (cmd.validate_yaml) {
	await vag.validate_yaml(argv.yaml_path as string);
}

if (cmd.versions) {
	console.log(`vag-version-short : ${Vag.version_short()}`);
}
