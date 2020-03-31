<p align="center"><img src="assets/logo-1024w.png" width="128" /></p>
<h1 align="center">IPFS Browser Sandbox</h1>

> An EXPERIMENTAL p2p browser built on IPFS

### ⚠️ Reference Use Only! ⚠️

**The IPFS Browser Sandbox is not a product intended to ship to end users.**  

It is a Technology Preview for how [IPFS](https://ipfs.io)/[IPLD](https://ipld.io/) resources could be represented in web browser components.

It is here for demos, experimentation and fun times.

It's also **not secure** and may be partly or entirely broken. Use at your own risk.

<img alt="Screenshot 2020-03-28 at 23 41 20" src="https://user-images.githubusercontent.com/152863/77836411-d947c000-714d-11ea-84cd-722734c2ac25.png">

## Install

### Prebuilt packages

Check out the [releases page](https://github.com/alanshaw/ipfs-browser-sandbox/releases) for prebuilt packages.

### From Source

If there's no prebuilt package for your system, you can always build from source. Good news, it's easy!

```console
git clone https://github.com/alanshaw/ipfs-browser-sandbox.git
cd ipfs-browser-sandbox
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

Feel free to dive in! [Open an issue](https://github.com/alanshaw/ipfs-browser-sandbox/issues/new) or submit PRs.

## License

[MIT](LICENSE) © Alan Shaw
