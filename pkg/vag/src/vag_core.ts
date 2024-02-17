// vag.ts

import path from 'node:path';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import fse from 'fs-extra';
import YAML from 'yaml';
import { simpleGit } from 'simple-git';

const vag_version_short = '0.0.1';
const vag_version_long = 'vag_0.0.1.0_d2e7b9ef_20240215_085131';

const regex_pointSlash = /^\.\//;
const regex_trailingSlash = /\/$/;

async function isGitRepo(pathDir2: string): Promise<boolean> {
	let isRepo = false;
	let isRepoCandidate = false;
	const subdirs = await fse.readdir(pathDir2, { withFileTypes: true });
	for (const subitem of subdirs) {
		// Pre-condition to check if pathDir2 is a git-repo
		if (subitem.isDirectory() && subitem.name === '.git') {
			isRepoCandidate = true;
		}
	}
	if (isRepoCandidate) {
		try {
			//const git1:any = simpleGit(pathDir2); // seems that the type of the argument of git.checkIsRepo() is not properly defined
			//const git1cmd = await git1.checkIsRepo('root');
			//console.log(git1cmd);
			//isRepo = gitcmd;
			const git2 = simpleGit(pathDir2);
			const git2cmd = await git2.revparse(['--show-prefix']);
			//console.log('A' + gitcmd + 'Z');
			if (git2cmd === '') {
				isRepo = true;
			}
		} catch (err) {
			//console.log(err);
		}
		if (!isRepo) {
			console.log(
				`INFO299: the directory ${pathDir2} contains a sub-directory .git but is not a git-repository`
			);
		}
	}
	return isRepo;
}

async function searchGitRepo(pathDir: string, deepSearch = true): Promise<string[]> {
	let r_list: string[] = [];
	//console.log("dbg538: current pathDir: " + pathDir);
	const local_list = await fse.readdir(pathDir, { withFileTypes: true });
	for (const item of local_list) {
		if (item.isDirectory()) {
			const pathDir2 = pathDir + '/' + item.name;
			if (['.git', 'node_modules'].includes(item.name)) {
				//console.log("Ignore " + pathDir2);
			} else {
				//console.log("dbg 949: pathDir2: " + pathDir2);
				const isRepo = await isGitRepo(pathDir2);
				if (isRepo) {
					//console.log("Found git-repo: " + pathDir2);
					r_list.push(pathDir2);
				}
				if (deepSearch || !isRepo) {
					r_list = r_list.concat(await searchGitRepo(pathDir2, deepSearch));
				}
			}
		}
	}
	return r_list;
}

function array_intersection(arr1: string[], arr2: string[]): string[] {
	return arr1.filter((elem) => arr2.includes(elem));
}

function array_exclude(arr_base: string[], arr_exclude: string[]): string[] {
	return arr_base.filter((elem) => !arr_exclude.includes(elem));
}

async function git_clone(localPath: string, remote_url: string, version: string): Promise<number> {
	let r_code = -1;
	try {
		if (!fs.existsSync(localPath)) {
			const git = simpleGit();
			const gitlog = await git.clone(remote_url, localPath);
			console.log(gitlog);
			r_code = await git_checkout(localPath, version);
		} else {
			const fstat = await fsp.stat(localPath);
			if (fstat.isDirectory()) {
				const isRepo = await isGitRepo(localPath);
				if (isRepo) {
					const git2 = simpleGit(localPath);
					const remote = await git2.getRemotes(true);
					const remote_url = remote[0].refs.fetch;
					//console.log(remote_url);
					if (remote_url === remote_url) {
						console.log(
							`INFO398: the git-repo ${localPath} is already cloned! Then just git-pull!`
						);
						const gitlog2 = await git2.pull();
						console.log(gitlog2);
						r_code = await git_checkout(localPath, version);
					} else {
						console.log(
							`WARN381: Warning, the git-repo ${localPath} already exist but with an unexpected remote! git-clone/pull aborted!`
						);
					}
				} else {
					console.log(
						`WARN869: Warning, the directory ${localPath} already exist but is not a git-repo! git-clone aborted!`
					);
				}
			} else {
				console.log(
					`WARN537: Warning, the path ${localPath} already exist and is a file! git-clone aborted!`
				);
			}
		}
	} catch (error) {
		console.log(`ERR162: Error by cloning ${localPath}  from  ${remote_url}`);
		console.error(error);
	}
	return r_code;
}

async function git_checkout(repoPath: string, version: string): Promise<number> {
	let r_code = -2;
	try {
		const git = simpleGit(repoPath);
		const gitlog = await git.checkout(version);
		console.log(gitlog);
		r_code = 0;
	} catch (error) {
		console.log(`ERR523: Error by checkout ${repoPath}  for version  ${version}`);
		console.error(error);
	}
	return r_code;
}

async function git_verify(repoPath: string, remote_url: string, version: string): Promise<number> {
	let r_code = 0;
	const one_info = await one_repo_info(repoPath);
	if (one_info.url === remote_url) {
		console.log(`remote_url: Ok`);
	} else {
		console.log(`remote_url: Nok   ${remote_url} versus ${one_info.url}`);
		r_code = -1;
	}
	if (one_info.branch === version || one_info.commit === version) {
		console.log(`version: Ok`);
	} else {
		console.log(
			`version: Nok   ${version} versus ${one_info.branch} versus ${one_info.commit}`
		);
		r_code = -1;
	}
	return r_code;
}

async function git_custom(repoPath: string, gitCommand: string): Promise<number> {
	let r_code = -1;
	try {
		const git = simpleGit(repoPath);
		const gitCommand2 = gitCommand.split(' ');
		const gitlog = await git.raw(...gitCommand2);
		console.log(gitlog);
		r_code = 0;
	} catch (error) {
		console.log(`ERR772: Error by git-command ${gitCommand}  on repo  ${repoPath}`);
		console.error(error);
	}
	return r_code;
}

interface tRepoInfo {
	localPath: string;
	url: string;
	branch: string;
	commit: string;
}

async function one_repo_info(localPath: string): Promise<tRepoInfo> {
	let one_info = {
		localPath: 'undefined',
		url: 'undefined',
		branch: 'undefined',
		commit: 'undefined'
	};
	const localPath2 = localPath.replace(regex_pointSlash, '');
	try {
		const git = simpleGit(localPath);
		const remote = await git.getRemotes(true);
		//console.log(remote);
		const remote_url = remote[0].refs.fetch;
		const branch = await git.branch();
		//console.log(branch);
		const branch_current = branch.current;
		const commit = await git.log();
		//console.log(commit);
		const commit_hash = commit.latest!.hash;
		one_info = {
			localPath: localPath2,
			url: remote_url,
			branch: branch_current,
			commit: commit_hash
		};
		//console.log(info);
	} catch (error) {
		console.log(`ERR398: Error by git-operations on repo  ${localPath}`);
		console.error(error);
	}
	return one_info;
}

async function get_repos_info(repos: string[]): Promise<tRepoInfo[]> {
	const repos_info = [];
	for (const [idx, localPath] of repos.entries()) {
		console.log(`===> ${idx + 1} - get info of git-repo  ${localPath}`);
		const one_info = await one_repo_info(localPath);
		//console.log(info);
		repos_info.push(one_info);
	}
	return repos_info;
}

async function validate_yaml_external(yamlPath: string): Promise<number> {
	let fyaml: tFileYaml;
	try {
		const fstr = await fse.readFile(yamlPath, 'utf-8');
		fyaml = YAML.parse(fstr);
	} catch (error) {
		console.log(`ERR439: Error by reading the yaml-file ${yamlPath}!`);
		console.error(error);
		return -1;
	}
	try {
		if (!Object.hasOwn(fyaml, 'repositories')) throw 'The property "repositories" is missing!';
		for (const repo in fyaml.repositories) {
			if (!Object.hasOwn(fyaml.repositories[repo], 'url'))
				throw `The property "url" is missing for repo ${repo} !`;
			if (!Object.hasOwn(fyaml.repositories[repo], 'version'))
				throw `The property "version" is missing for repo ${repo} !`;
			if (!Object.hasOwn(fyaml.repositories[repo], 'type')) {
				console.log(`WARN390: Warning, the property "type" is missing for repo ${repo} !`);
			} else if (fyaml.repositories[repo].type !== 'git') {
				console.log(
					`WARN395: Warning, the property "type" of repo ${repo} is not git but ${fyaml.repositories[repo].type}!`
				);
			}
		}
		console.log(`The yaml-file ${yamlPath} is valid!`);
		return 0;
	} catch (error) {
		console.error(error);
		console.log(`Invalid yaml-file ${yamlPath}!`);
		return -2;
	}
}

function isPathAbsolute(path: string): boolean {
	let r_absolute = false;
	const regex_slash = /^\//;
	if (regex_slash.test(path)) {
		r_absolute = true;
	}
	return r_absolute;
}

/** The interface `tListC` is used to construct the property `listC`. */
interface tListC {
	[p: string]: {
		url: string;
		version: string;
	};
}

/** The interface `tFileYaml` is used to generate the object that will be exported as Yaml-file. */
interface tFileYaml {
	repositories: {
		[key: string]: {
			type: string;
			url: string;
			version: string;
		};
	};
}

/**
 * A class that contains a list of configured repositories, a list of discovered repositories and methods that use those two lists.
 */
class Vag {
	/** The top directory from where to search repositories. */
	discoverDir: string;
	/** When a repository is encountered, should it be inspected for searching sub-repositories? */
	deepSearch: boolean;
	/** The path to the yaml-file that provides the repositories to be cloned. */
	importYaml: string;
	/** The base directory where the directories listed in the yaml-file should be cloned. */
	importDir: string;
	/** The list of the path of the discovered repositories. It is populated by the `init()` method. */
	listD: string[];
	/** An object with the content of the yaml-file. It is populated by the `init()` method. */
	listC: tListC;

	/**
	 * The constructor of the `Vag` class.
	 * `listD` is initialized to an empty list.
	 * `listC` is initialized to an empty object.
	 */
	constructor(discoverDir = '.', deepSearch = true, importYaml = '', importDir = '') {
		this.discoverDir = discoverDir;
		this.deepSearch = deepSearch;
		this.importYaml = importYaml;
		this.importDir = importDir;
		this.listD = []; // list of the discovered git-repositories
		this.listC = {}; // list of the configured git-repositories
	}

	// this init function cannot be included in the constructor because the constructor can not be async
	async discover_repos(
		discoverDir = this.discoverDir,
		deepSearch = this.deepSearch
	): Promise<number> {
		this.discoverDir = discoverDir;
		this.deepSearch = deepSearch;
		// check if empty string
		if (this.discoverDir === '') {
			console.log(`ERR282: Error, the discoverDir cannot be an empty string`);
			return -1;
		}
		// normalize path
		if (!isPathAbsolute(this.discoverDir)) {
			if (!regex_pointSlash.test(this.discoverDir) && this.discoverDir !== '.') {
				this.discoverDir = './' + this.discoverDir;
			}
		}
		this.discoverDir = this.discoverDir.replace(regex_trailingSlash, '');
		//console.log(this.discoverDir);
		// check if the path exist
		try {
			await fse.readdir(this.discoverDir, { withFileTypes: true });
		} catch (err) {
			console.log(`ERR638: Error, the path ${this.discoverDir} doesn't exist!`);
			console.log(err);
			return -1;
		}
		this.listD = await searchGitRepo(this.discoverDir, this.deepSearch);
		console.log(`Number of discovered cloned git repos: ${this.listD.length}`);
		return 0;
	}

	async import_yaml(importYaml = this.importYaml, importDir = this.importDir): Promise<number> {
		let r_code = 0;
		this.importYaml = importYaml;
		this.importDir = importDir;
		if (this.importYaml !== '') {
			let baseDir = path.dirname(this.importYaml);
			if (this.importDir !== '') {
				baseDir = this.importDir;
			}
			if (['', '.'].includes(baseDir)) {
				baseDir = '';
			} else {
				if (!regex_trailingSlash.test(baseDir)) {
					baseDir = baseDir + '/';
				}
			}
			//console.log(baseDir);
			const list_non_git = [];
			try {
				const fstr = await fse.readFile(this.importYaml, 'utf-8');
				const fyaml = YAML.parse(fstr);
				//console.log(fyaml);
				for (const repoDir in fyaml.repositories) {
					//console.log(repoDir);
					// repoDir2 unifies the path format with the discovered git-repos
					let repoDir2 = repoDir;
					if (!isPathAbsolute(repoDir2)) {
						repoDir2 = baseDir + repoDir;
						if (!regex_pointSlash.test(repoDir2)) {
							repoDir2 = './' + repoDir2;
						}
					}
					//console.log(fyaml.repositories[repoDir].type);
					if (
						!Object.hasOwn(fyaml.repositories[repoDir], 'type') ||
						fyaml.repositories[repoDir].type === 'git'
					) {
						this.listC[repoDir2] = {
							url: fyaml.repositories[repoDir].url,
							version: fyaml.repositories[repoDir].version
						};
					} else {
						list_non_git.push(repoDir2);
					}
				}
			} catch (error) {
				console.log(
					`ERR826: Error, the imported-yaml-file ${this.importYaml} is not valid!`
				);
				console.error(error);
				r_code = -1;
			}
			console.log(
				`From imported Yaml, number of git-repos: ${Object.keys(this.listC).length}`
			);
			console.log(`From imported Yaml, number of excluded repos: ${list_non_git.length}`);
			for (const [idx, repoDir] of list_non_git.entries()) {
				console.log(
					`  ${(idx + 1).toString().padStart(3, ' ')} - Excluded repo: ${repoDir}`
				);
			}
		}
		return r_code;
	}

	/**
	 * The `init` method populate populate `listD` and `listC`.
	 * It must be called just after instanciating `Vag`.
	 * The configuration properties `discoverDir`, `deepSearch`, `importYaml` and `importDir` can be reassinged by `init`.
	 */
	async init(
		discoverDir = this.discoverDir,
		deepSearch = this.deepSearch,
		importYaml = this.importYaml,
		importDir = this.importDir
	): Promise<number> {
		let r_code = 0;
		r_code += await this.discover_repos(discoverDir, deepSearch);
		r_code += await this.import_yaml(importYaml, importDir);
		return r_code;
	}

	/** List the discovered repositories. */
	d_list(): string[] {
		return this.listD;
	}

	/** List the wished repositories (a.k.a. configured repositories). */
	c_list(): string[] {
		return Object.keys(this.listC);
	}

	/** List the git-repos which are in the D-list and in the C-list. I.e. Intersection of D and C. */
	cd_list(): string[] {
		return array_intersection(this.listD, Object.keys(this.listC));
	}

	/** List the git-repos which are in the D-list but not in the C-list. I.e. D not C. */
	dnc_list(): string[] {
		return array_exclude(this.listD, Object.keys(this.listC));
	}

	/** List the git-repos which are in the C-list but not in the D-list. I.e. C not D. */
	cnd_list(): string[] {
		return array_exclude(Object.keys(this.listC), this.listD);
	}

	/** Clone the repositories of `listC`. */
	async c_clone(): Promise<number> {
		let r_code = 0;
		for (const [idx, localPath] of Object.keys(this.listC).entries()) {
			const repo = this.listC[localPath];
			console.log(
				`===> ${idx + 1} - clone  ${localPath}  from  ${
					repo.url
				}  at version  ${repo.version}`
			);
			r_code += await git_clone(localPath, repo.url, repo.version);
		}
		return r_code;
	}

	/** Checkout the repositories listed in `listC` and `listD`. */
	async cd_checkout(): Promise<number> {
		let r_code = 0;
		const list_cd = this.cd_list();
		for (const [idx, localPath] of list_cd.entries()) {
			const repo = this.listC[localPath];
			console.log(`===> ${idx + 1} - checkout  ${localPath}  at version  ${repo.version}`);
			r_code += await git_checkout(localPath, repo.version);
		}
		return r_code;
	}

	/** For the repositories listed in `listC` and `listD`, verify if they fit with the configuration of Yaml-file. */
	async cd_verify(): Promise<number> {
		let r_code = 0;
		const list_cd = this.cd_list();
		for (const [idx, localPath] of list_cd.entries()) {
			const repo = this.listC[localPath];
			console.log(`===> ${idx + 1} - verify  ${localPath}`);
			r_code += await git_verify(localPath, repo.url, repo.version);
		}
		const all_nb = list_cd.length;
		const nok_nb = Math.abs(r_code);
		const ok_nb = all_nb - nok_nb;
		console.log(`Verify ${all_nb} repos : ${ok_nb} Ok, ${nok_nb} Nok`);
		return r_code;
	}

	/** Run a custom git-command on the discoverd repositories (`listD`). */
	async d_custom(git_command: string, only_configured_repo = false): Promise<number> {
		let r_code = 0;
		let repos = this.d_list();
		if (only_configured_repo) {
			repos = this.cd_list();
		}
		for (const [idx, localPath] of repos.entries()) {
			console.log(
				`===> ${idx + 1} - On git-repo  ${localPath}  with command  git ${git_command}`
			);
			r_code += await git_custom(localPath, git_command);
		}
		return r_code;
	}

	/** Git-fetch on the discoverd repositories (`listD`). */
	async d_fetch(only_configured_repo = false): Promise<number> {
		return await this.d_custom('fetch --prune', only_configured_repo);
	}

	/** Git-pull on the discoverd repositories (`listD`). */
	async d_pull(only_configured_repo = false): Promise<number> {
		return await this.d_custom('pull', only_configured_repo);
	}

	/** Git-push on the discoverd repositories (`listD`). */
	async d_push(only_configured_repo = false): Promise<number> {
		return await this.d_custom('push', only_configured_repo);
	}

	/** Show the current branch of the discoverd repositories (`listD`). */
	async d_branch(only_configured_repo = false): Promise<number> {
		return await this.d_custom('branch --show-current', only_configured_repo);
	}

	/** Git-status on the discoverd repositories (`listD`). */
	async d_status(only_configured_repo = false): Promise<number> {
		return await this.d_custom('status', only_configured_repo);
	}

	/** Git-diff on the discoverd repositories (`listD`). */
	async d_diff(only_configured_repo = false): Promise<number> {
		return await this.d_custom('diff', only_configured_repo);
	}

	/** `Git-log -n 3` on the discoverd repositories (`listD`). */
	async d_log(only_configured_repo = false): Promise<number> {
		return await this.d_custom('log -n 3', only_configured_repo);
	}

	/** `Git-remote -vv` on the discoverd repositories (`listD`). */
	async d_remote(only_configured_repo = false): Promise<number> {
		return await this.d_custom('remote -vv', only_configured_repo);
	}

	/** `Git-stash list` on the discoverd repositories (`listD`). */
	async d_stash_list(only_configured_repo = false): Promise<number> {
		return await this.d_custom('stash list', only_configured_repo);
	}

	/** `Git-clean -dxf` on the discoverd repositories (`listD`). */
	async d_clean(only_configured_repo = false): Promise<number> {
		return await this.d_custom('clean -dxf', only_configured_repo);
	}

	/** Export in a Yaml-file the list of discoverd repositories (`listD`). */
	async d_export_yaml(yamlPath: string, commit_version = false): Promise<number> {
		let r_code = -1;
		if (yamlPath === '') {
			console.log(`ERR482: Error, the discoverDir cannot be an empty string`);
			return -1;
		}
		const repos = this.d_list();
		const repos_info = await get_repos_info(repos);
		const fyaml: tFileYaml = { repositories: {} };
		for (const repo of repos_info) {
			let version = repo.branch;
			if (commit_version) {
				version = repo.commit;
			}
			fyaml.repositories[repo.localPath] = {
				type: 'git',
				url: repo.url,
				version: version
			};
		}
		//console.log(fyaml);
		const fstr = YAML.stringify(fyaml);
		try {
			await fse.outputFile(yamlPath, fstr);
			r_code = 0;
		} catch (error) {
			console.log(`ERR218: Error by writting the yaml-file ${yamlPath}!`);
			console.error(error);
		}
		console.log(`The yaml-file ${yamlPath} has been written!`);
		return r_code;
	}

	/**
	 * Validate a yaml-file that could be imported later on.
	 *
	 * @param yamlPath the path to the yaml-file to be checked/validated.
	 * @returns an integer-code. 0 if the validation is successful, negative otherwise.
	 */
	async validate_yaml(yamlPath: string): Promise<number> {
		if (yamlPath === '') {
			console.log(`ERR482: Error, the discoverDir cannot be an empty string`);
			return -1;
		}
		return await validate_yaml_external(yamlPath);
	}

	/**
	 * Return a string with the three numbers (major, minor, patch) written in the package.json.
	 *
	 * @returns the string Major.Minor.Patch
	 */
	static version_short(): string {
		return vag_version_short;
	}

	/**
	 * Return a long string including the last commit hash, timestamp, build-number.
	 * The string composition is PackageName_Major.Minor.Patch.BuildNumber_CommitHash_BuildDate_BuildTime
	 *
	 * @returns a long string with version information
	 */
	static version_long(): string {
		return vag_version_long;
	}
}

export type { tListC };
export { Vag };
