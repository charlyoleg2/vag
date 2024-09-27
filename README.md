README of Vag
=============

Presentation
------------

*vag* is a *javascript* library, cli-app and ui-app for managing sub-repositories.
It currently supports only *git* repositories.

*Vag* is inspired by:
- [vcstool](https://github.com/dirk-thomas/vcstool) : managing the sub-repos of [ROS](http://docs.ros.org/)
- [subg](https://github.com/charlyoleg/subg) : a PoC of porting *vcstool* in the *javascript* ecosystem
- [simplest-git-subrepos](https://github.com/jmnavarrol/simplest-git-subrepos) : thoughts about sub-repositories
- [multigit](https://github.com/jmnavarrol/python-multigit) : a *Python* tool for managing sub-repos


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


Upgrade dependencies
--------------------

```bash
npm outdated
npm update --save
git commit -am 'npm update --save'
```
or
```bash
npx npm-check-updates
npx npm-check-updates --upgrade
npm install
git commit -am 'npx npm-check-updates --upgrade'
```


Publish a new release
---------------------

```bash
npm run versions
git commit -am 'increment sub-package versions'
npm version patch
git push
git push origin v0.5.3
```

