#!/usr/bin/env node
/**
 * Generate the downloadable PDF from content/resume.md.
 * Requires Node.js 22+, Hugo, and Google Chrome or Chromium; no npm packages.
 *
 *   node scripts/generate-resume.mjs
 *   node scripts/generate-resume.mjs --html-output /tmp/linjia-resume.html
 *
 * --chrome selects a browser executable; --output selects a different PDF path.
 * The print layout is isolated in scripts/resume-print.html. Inspect page breaks
 * after changing the Markdown. Website front matter and the PDF download link
 * are excluded from the printable document.
 */
import { spawn, spawnSync } from 'node:child_process';
import { closeSync, copyFileSync, existsSync, mkdirSync, mkdtempSync, openSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const options = {
  output: join(root, 'static/documents/linjia-hu-resume.pdf'),
  'html-output': null,
  chrome: null,
};
for (let index = 2; index < process.argv.length; index++) {
  const name = process.argv[index].replace(/^--/, '');
  if (name === 'help') {
    console.log('Usage: node scripts/generate-resume.mjs [--output resume.pdf] [--html-output resume.html] [--chrome /path/to/chrome]');
    process.exit(0);
  }
  if (!Object.hasOwn(options, name) || !process.argv[index + 1]) {
    console.error(`Unknown or incomplete option: ${process.argv[index]}`);
    process.exit(1);
  }
  options[name] = process.argv[++index];
}

function executable(name) {
  if (name.includes('/')) return existsSync(name) ? name : null;
  const result = spawnSync('which', [name], { encoding: 'utf8' });
  return result.status === 0 ? result.stdout.trim() : null;
}

async function withTimeout(promise, label, milliseconds = 30000) {
  let timer;
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error(`${label} timed out.`)), milliseconds);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

function connect(url) {
  return new Promise((resolveConnection, reject) => {
    const socket = new WebSocket(url);
    const pending = new Map();
    let nextId = 0;
    let loaded;
    const pageLoaded = new Promise((resolveLoaded) => { loaded = resolveLoaded; });
    socket.addEventListener('error', () => reject(new Error('Could not connect to Chrome.')));
    socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (message.method === 'Page.loadEventFired') loaded();
      const request = pending.get(message.id);
      if (!request) return;
      pending.delete(message.id);
      if (message.error) request.reject(new Error(message.error.message));
      else request.resolve(message.result);
    });
    socket.addEventListener('open', () => resolveConnection({
      pageLoaded,
      close: () => socket.close(),
      send(method, params = {}) {
        return withTimeout(new Promise((resolveRequest, rejectRequest) => {
          const id = ++nextId;
          pending.set(id, { resolve: resolveRequest, reject: rejectRequest });
          socket.send(JSON.stringify({ id, method, params }));
        }), method);
      },
    }));
  });
}

async function generate() {
  if (typeof WebSocket === 'undefined') throw new Error('Node.js 22 or newer is required.');
  const hugo = executable('hugo');
  if (!hugo) throw new Error('Hugo is required; use the version documented for this site.');
  const chrome = options.chrome ? executable(options.chrome) : [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    'google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser',
  ].map(executable).find(Boolean);
  if (!chrome) throw new Error('Google Chrome or Chromium is required; provide its executable with --chrome.');

  const work = mkdtempSync(join(tmpdir(), 'linjia-resume-'));
  const chromeLog = openSync(join(work, 'chrome.log'), 'w');
  let browser;
  let cdp;
  try {
    mkdirSync(join(work, 'content'));
    mkdirSync(join(work, 'layouts'));
    const markdown = readFileSync(join(root, 'content/resume.md'), 'utf8');
    const body = markdown.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, '');
    writeFileSync(join(work, 'content/_index.md'), body);
    copyFileSync(join(root, 'scripts/resume-print.html'), join(work, 'layouts/home.html'));
    writeFileSync(join(work, 'hugo.toml'), `baseURL = "https://linjiah.github.io/"
title = "Linjia Hu"
disableKinds = ["taxonomy", "term", "RSS", "sitemap", "robotsTXT"]
[markup.goldmark.renderer]
unsafe = true
`);
    const build = spawnSync(hugo, ['--source', work, '--destination', join(work, 'public'), '--quiet'], {
      encoding: 'utf8', timeout: 30000,
    });
    if (build.error || build.status !== 0) throw new Error(build.error?.message || build.stderr || build.stdout);
    const html = join(work, 'public/index.html');
    if (options['html-output']) {
      mkdirSync(dirname(resolve(options['html-output'])), { recursive: true });
      copyFileSync(html, resolve(options['html-output']));
    }

    const profile = join(work, 'chrome-profile');
    browser = spawn(chrome, [
      '--headless', '--no-sandbox', '--disable-gpu', '--no-first-run',
      '--no-default-browser-check', '--disable-extensions',
      '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank',
    ], { detached: true, stdio: ['ignore', chromeLog, chromeLog] });
    let launchError;
    browser.on('error', (error) => { launchError = error; });
    const portFile = join(profile, 'DevToolsActivePort');
    for (let attempt = 0; attempt < 100 && !existsSync(portFile); attempt++) {
      if (launchError) throw launchError;
      if (browser.exitCode !== null || browser.signalCode !== null) throw new Error(`Chrome exited before becoming ready: ${readFileSync(join(work, 'chrome.log'), 'utf8')}`);
      await delay(100);
    }
    if (!existsSync(portFile)) throw new Error('Chrome did not become ready within 10 seconds.');
    const port = readFileSync(portFile, 'utf8').split('\n')[0];
    const target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, {
      method: 'PUT', signal: AbortSignal.timeout(10000),
    })).json();
    cdp = await withTimeout(connect(target.webSocketDebuggerUrl), 'Connecting to Chrome', 10000);
    await cdp.send('Page.enable');
    await cdp.send('Page.navigate', { url: pathToFileURL(html).href });
    await withTimeout(cdp.pageLoaded, 'Loading the print document');
    await cdp.send('Runtime.evaluate', { expression: 'document.fonts.ready.then(() => true)', awaitPromise: true });
    await cdp.send('Emulation.setEmulatedMedia', { media: 'print' });
    const { data } = await cdp.send('Page.printToPDF', {
      printBackground: true, preferCSSPageSize: true, generateTaggedPDF: true,
      displayHeaderFooter: false, marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0,
    });
    const pdf = Buffer.from(data, 'base64');
    if (pdf.subarray(0, 5).toString() !== '%PDF-') throw new Error('Chrome returned an invalid PDF.');
    const output = resolve(options.output);
    mkdirSync(dirname(output), { recursive: true });
    writeFileSync(output, pdf);
    console.log(`Generated ${output} from content/resume.md`);
  } finally {
    cdp?.close();
    if (browser?.pid) {
      try { process.kill(-browser.pid, 'SIGTERM'); } catch (error) { if (error.code !== 'ESRCH') throw error; }
      await delay(250);
      try { process.kill(-browser.pid, 'SIGKILL'); } catch (error) { if (error.code !== 'ESRCH') throw error; }
    }
    closeSync(chromeLog);
    rmSync(work, { recursive: true, force: true });
  }
}

try {
  await generate();
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
}
