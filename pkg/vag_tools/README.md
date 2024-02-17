README of vag\_tools
====================


Presentation
------------

*vag\_tools* is a *nodejs* package for managing git sub-repositories. It contains:

- vag\_core: a javascript library proposing all the featues via an API
- vag: a CLI-app with the same features for the command-line
- vagg: a Web-UI (starting a server and opening a UI-page in the browser) with the same features


Requirements
------------

- [node](https://nodejs.org) > 20.10.0
- [npm](https://docs.npmjs.com/cli) > 10.1.0


Installation
------------

```bash
npm i -D vag_tools
npx vag --help
```


Config file
-----------

An example of config file for *vag*:

```yaml
repositories:
  repos/parametrix:
    type: git
    url: git@github.com:charlyoleg2/parametrix.git
    version: main
  repos/parame_paxApps:
    url: https://github.com/charlyoleg2/parame_paxApps.git
    version: main
  repos/parame51:
    url: https://github.com/charlyoleg2/parame51.git
    version: main
```


Usage in script
---------------

```javascript
import { Vag } from 'vag_core';

Vag.version_short()

const vag = new Vag(argv.discoverDir, argv.deepSearch, argv.importYaml, argv.importDir);
await vag.init();

await vag.c_clone();
await vag.cd_checkout();
await vag.d_pull(argv.only_configured);
await vag.d_push(argv.only_configured);
```


Usage in command-line
---------------------

```bash
npx vag --help
npx vag --importYaml=parametrix_repos.yml list
npx vag --importYaml=parametrix_repos.yml clone
```





