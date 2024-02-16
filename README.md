README of Vag
=============

Presentation
------------

*vag* is a *javascript* library, cli-app and ui-app for managing sub-repositories.
It currently supports only *git* repositories.

*Vag* is inspired by [vcstool](https://github.com/dirk-thomas/vcstool),
[subg](https://github.com/charlyoleg/subg),
[simplest-git-repos](https://github.com/jmnavarrol/simplest-git-subrepos) and
[multigit](https://github.com/jmnavarrol/python-multigit)


Using the *vag* CLI
-------------------

In a terminal, run:

```shell
npx vag help
npx vag pull
npx vag status
npx vag diff
npx vag push
```


Using the *vag* UI
-------------------

In a terminal, run:

```shell
npx vagg
```
and open the browser at <http://localhost:7808>


Using the *vag* API
-------------------

In your script.js:

```javascript
import vag from 'vag';

cont vag_response = await vag.pull();
```


Dev
---

In a terminal, run:

```shell
git clone https://github.com/charlyoleg2/vag.git
cd vag
npm install
npm run build
node dist/vag.js
node dist/vag.js help
node dist/vag.js pull
node dist/vag.js status
node dist/vag.js diff
node dist/vag.js push
```
