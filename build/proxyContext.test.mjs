import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { engineFixture, svg } from '../../Space-v2/tests/fixtures/scramjet.mjs';
import ts from 'typescript';
import { runInNewContext } from 'node:vm';

test('Nebula adapter uses explicitly copied real bundle and actual response pipeline', async () => {
  assert.ok(existsSync('src/utils/proxyContext-generated/proxy-context-host.js'), 'host build copies missing');
  const { installScramjetProxyContext, spaceGamesUrl } = await import('../src/utils/proxyContext-generated/proxy-context-host.js');
  assert.equal(spaceGamesUrl('https://space.example/'), 'https://space.example/?view=games');
  assert.throws(() => spaceGamesUrl(''), /Configure/);
  assert.throws(() => spaceGamesUrl('javascript:alert(1)'), /HTTP/);
  const fixture = engineFixture(new URL('../', import.meta.url));
  Object.assign(globalThis, { $scramjet: fixture.engine, DOMParser: fixture.win.DOMParser });
  const dispose = installScramjetProxyContext(fixture.controller, readFileSync('src/utils/proxyContext-generated/proxy-context-adapter.js', 'utf8'));
  try {
    const response = await fixture.response(fixture.controller.createFrame(), svg);
    assert.equal(response.headers.get('content-type'), 'text/html; charset=utf-8');
    assert.ok(response.body.includes(encodeURIComponent('https://space.example/index.html?view=games')));
  } finally { dispose(); fixture.close(); }
});

test('games keeps localized paths, drops Truffled, and exposes configuration errors', () => {
  const source = readFileSync('src/pages/[lang]/games.astro', 'utf8');
  assert.ok(source.includes('getStaticPaths = () => STATIC_PATHS'));
  assert.ok(!source.includes('truffled.lol'));
  assert.ok(source.includes('SPACE_ORIGIN'));
  assert.ok(source.includes('role="alert"'));
  assert.ok(readFileSync('config.example.toml', 'utf8').includes('space_origin'));
});

test('games waits for asynchronous host installation and reports a bounded startup failure', async () => {
  const path = 'src/utils/proxyContext-ready.ts';
  assert.ok(existsSync(path), 'host startup synchronization helper');
  const exports = {};
  const code = ts.transpileModule(readFileSync(path, 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText;
  runInNewContext(code, { exports });
  const win = Object.assign(new EventTarget(), { setTimeout, clearTimeout });
  const pending = exports.waitForProxyController(win, 100);
  const controller = { wait: async () => {} };
  win.controller = controller;
  win.dispatchEvent(new Event('proxy-context-host-ready'));
  assert.equal(await pending, controller);
  assert.equal(await exports.waitForProxyController(win, 100), controller);
  delete win.controller;
  await assert.rejects(exports.waitForProxyController(win, 5), /did not become ready/);
});
