<p align="center"><img src="assets/logo-1024w.png" width="128" /></p>
<h1 align="center">Planetary Browser (EXPERIMENTAL)</h1>

> An experimental p2p browser built on IPFS

⚠️ This project is experimental! It is _not secure_ and may be partly or entirely broken. Use at your own risk. It is here for demos, experimentation and fun times.

<img alt="Screenshot 2020-03-26 at 23 09 11" src="https://user-images.githubusercontent.com/152863/77705175-e4b4b300-6fb6-11ea-90a1-972c3c53b162.png">

## Install

There are currently no binaries available for download. You must build the project from source. Good news though, it's easy!

```console
git clone https://github.com/alanshaw/planetarybrowser.git
cd planetarybrowser
npm install
npm run build
npm start
```

## Usage

It's a browser, you know what to do...but wait! It also allows you to browse the IPFS-iverse. Paste an IPFS hash into the URL bar and the content will appear on the page. Magic!

### Developers

There's a watch script that'll watch all the JS files and re-build them when you make changes:

```console
npm run watch
```

## Contribute

Feel free to dive in! [Open an issue](https://github.com/alanshaw/planetarybrowser/issues/new) or submit PRs.

## License

[MIT](LICENSE) © Alan Shaw
