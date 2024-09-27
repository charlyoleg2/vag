create-vag
==========


Presentation
------------

*create-vag* is the *initializer* used by *npm* for creating a new [vag](https://github.com/charlyoleg2/vag) repository. It contains the *command line interface* application called by `npm create vag@latest`.


Links
-----

- [sources](https://github.com/charlyoleg2/create-vag)
- [pkg](https://www.npmjs.com/package/create-vag)


Requirements
------------

- [node](https://nodejs.org) > 20.10.0
- [npm](https://docs.npmjs.com/cli) > 10.5.0


Usage
-----

*create-vag* is not intended to be installed directly but rather used via one of the following commands:

```bash
npm create vag@latest
npm create vag@latest projAbc
npm init vag@latest projAbc
npm exec create-vag@latest projAbc
npx create-vag@latest projAbc
```

Dev
---

```bash
git clone https://github.com/charlyoleg2/create-vag
cd create-vag
npm install
npm run ci
npm run run
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
npm version patch
git push
git push origin v0.5.6
```



