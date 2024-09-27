// create-vag-common.ts

interface tCfg1 {
	projName: string;
	repoName: string;
}
interface tCfg2 {
	projName: string;
	ProjName: string;
	ProjNameUnderline: string;
	repoName: string;
	RepoName: string;
	RepoNameUnderline: string;
}
interface tResp {
	vim: string;
}

function firstLetterCapital(str: string): string {
	const rStr = str.charAt(0).toUpperCase() + str.slice(1);
	return rStr;
}

function underline(str: string): string {
	const strLen = str.length;
	const rStr = '='.repeat(strLen);
	return rStr;
}

function prefixOutputPath(): string {
	let rPreDir = '.';
	const scriptDir = new URL('', import.meta.url).toString();
	//console.log(`dbg832: scriptDir: ${scriptDir}`);
	const regex = new RegExp('/node_modules/');
	if (!regex.test(scriptDir)) {
		rPreDir = './tmp';
	}
	return rPreDir;
}

export type { tCfg1, tCfg2, tResp };
export { firstLetterCapital, underline, prefixOutputPath };
