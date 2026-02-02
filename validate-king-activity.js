/*
 * Validates openings/king-activity-endgame.html VARIATIONS using chess.js (Node).
 * - Checks FEN loads
 * - Checks moves/steps length match
 * - Checks each SAN move is legal sequentially
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { Chess } = require('chess.js');

const HTML_PATH = path.join(__dirname, 'openings', 'king-activity-endgame.html');

function extractInlineScript(html) {
  const startIdx = html.indexOf('<script>');
  if (startIdx === -1) throw new Error('No <script> tag found');
  const endIdx = html.indexOf('</script>', startIdx);
  if (endIdx === -1) throw new Error('No </script> closing tag found');
  return html.slice(startIdx + '<script>'.length, endIdx);
}

function extractConstString(script, constName) {
  const re = new RegExp(`\\bconst\\s+${constName}\\s*=\\s*([\"'])([^\"']+)\\1\\s*;`);
  const m = script.match(re);
  if (!m) throw new Error(`Failed to extract const ${constName}`);
  return m[2];
}

function findObjectLiteralAfter(script, marker) {
  const markerIdx = script.indexOf(marker);
  if (markerIdx === -1) throw new Error(`Marker not found: ${marker}`);

  const eqIdx = script.indexOf('=', markerIdx);
  if (eqIdx === -1) throw new Error(`No '=' after marker: ${marker}`);

  const firstBraceIdx = script.indexOf('{', eqIdx);
  if (firstBraceIdx === -1) throw new Error(`No '{' after marker: ${marker}`);

  let i = firstBraceIdx;
  let depth = 0;

  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;
  let inLineComment = false;
  let inBlockComment = false;
  let escape = false;

  for (; i < script.length; i++) {
    const ch = script[i];
    const next = script[i + 1];

    if (inLineComment) {
      if (ch === '\n') inLineComment = false;
      continue;
    }
    if (inBlockComment) {
      if (ch === '*' && next === '/') {
        inBlockComment = false;
        i++;
      }
      continue;
    }

    if (!inSingle && !inDouble && !inTemplate) {
      if (ch === '/' && next === '/') {
        inLineComment = true;
        i++;
        continue;
      }
      if (ch === '/' && next === '*') {
        inBlockComment = true;
        i++;
        continue;
      }
    }

    if (inSingle) {
      if (escape) {
        escape = false;
        continue;
      }
      if (ch === '\\') {
        escape = true;
        continue;
      }
      if (ch === "'") inSingle = false;
      continue;
    }

    if (inDouble) {
      if (escape) {
        escape = false;
        continue;
      }
      if (ch === '\\') {
        escape = true;
        continue;
      }
      if (ch === '"') inDouble = false;
      continue;
    }

    if (inTemplate) {
      if (escape) {
        escape = false;
        continue;
      }
      if (ch === '\\') {
        escape = true;
        continue;
      }
      if (ch === '`') inTemplate = false;
      continue;
    }

    if (ch === "'") {
      inSingle = true;
      continue;
    }
    if (ch === '"') {
      inDouble = true;
      continue;
    }
    if (ch === '`') {
      inTemplate = true;
      continue;
    }

    if (ch === '{') {
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0) {
        const objText = script.slice(firstBraceIdx, i + 1);
        return objText;
      }
    }
  }

  throw new Error(`Unbalanced braces while extracting object after: ${marker}`);
}

function loadVariationsFromHtml(htmlPath) {
  const html = fs.readFileSync(htmlPath, 'utf8');
  const script = extractInlineScript(html);

  const startFen = extractConstString(script, 'START_FEN');
  const variationsObjLiteral = findObjectLiteralAfter(script, 'const VARIATIONS');

  const sandbox = { START_FEN: startFen, VARIATIONS: undefined };
  vm.createContext(sandbox);
  vm.runInContext(`VARIATIONS = ${variationsObjLiteral};`, sandbox, { timeout: 1000 });

  return { startFen, variations: sandbox.VARIATIONS };
}

function validateFen(fen) {
  try {
    // Chess() will throw on invalid FEN in chess.js v1.x
    // eslint-disable-next-line no-new
    new Chess(fen);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e };
  }
}

function validateVariation(key, variation) {
  const problems = [];
  const required = ['title', 'fen', 'description', 'moves', 'steps'];
  for (const k of required) {
    if (variation[k] === undefined || variation[k] === null) {
      problems.push(`missing field: ${k}`);
    }
  }
  if (Array.isArray(variation.moves) && Array.isArray(variation.steps)) {
    if (variation.moves.length !== variation.steps.length) {
      problems.push(`moves.length(${variation.moves.length}) !== steps.length(${variation.steps.length})`);
    }
  }

  const fenCheck = validateFen(variation.fen);
  if (!fenCheck.ok) {
    problems.push(`invalid FEN: ${fenCheck.error && fenCheck.error.message ? fenCheck.error.message : String(fenCheck.error)}`);
    return { key, ok: false, problems };
  }

  const game = new Chess(variation.fen);
  if (!Array.isArray(variation.moves)) {
    problems.push('moves is not an array');
    return { key, ok: false, problems };
  }

  for (let i = 0; i < variation.moves.length; i++) {
    const moveStr = variation.moves[i];
    const fenBefore = game.fen();
    try {
      const move = game.move(moveStr, { sloppy: true });
      if (!move) {
        problems.push(`illegal move at index ${i}: ${moveStr}`);
        problems.push(`fen before: ${fenBefore}`);
        break;
      }
    } catch (e) {
      problems.push(`illegal move at index ${i}: ${moveStr}`);
      problems.push(`fen before: ${fenBefore}`);
      problems.push(`error: ${e && e.message ? e.message : String(e)}`);
      break;
    }
  }

  return { key, ok: problems.length === 0, problems };
}

function main() {
  const { startFen, variations } = loadVariationsFromHtml(HTML_PATH);
  console.log(`Loaded START_FEN: ${startFen}`);

  const keys = Object.keys(variations || {});
  if (keys.length === 0) {
    console.error('No VARIATIONS found');
    process.exitCode = 1;
    return;
  }

  let failed = 0;
  for (const key of keys) {
    const result = validateVariation(key, variations[key]);
    if (result.ok) {
      console.log(`✅ ${key}: OK`);
    } else {
      failed++;
      console.log(`❌ ${key}: FAIL`);
      for (const p of result.problems) console.log(`   - ${p}`);
    }
  }

  if (failed > 0) {
    process.exitCode = 1;
  }
}

main();
