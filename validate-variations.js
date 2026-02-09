/*
 * Validate VARIATIONS in a lesson HTML file (Node).
 * - Checks required fields
 * - Checks moves/steps length match
 * - Checks FEN loads
 * - Checks each SAN move is legal sequentially
 */

const fs = require('fs');
const vm = require('vm');

let Chess;
try {
  ({ Chess } = require('chess.js'));
} catch (e) {
  try {
    ({ Chess } = require('chess.js/dist/cjs/chess.js'));
  } catch (inner) {
    console.error('chess.js not found. Install dependencies or ensure node_modules exists.');
    process.exit(1);
  }
}

if (process.argv.length < 3) {
  console.error('Usage: node validate-variations.js <html-path>');
  process.exit(1);
}

const htmlPath = process.argv[2];
const html = fs.readFileSync(htmlPath, 'utf8');

function findObjectLiteralAfter(source, marker) {
  const markerIdx = source.indexOf(marker);
  if (markerIdx === -1) throw new Error(`Marker not found: ${marker}`);

  const eqIdx = source.indexOf('=', markerIdx);
  if (eqIdx === -1) throw new Error(`No '=' after marker: ${marker}`);

  const firstBraceIdx = source.indexOf('{', eqIdx);
  if (firstBraceIdx === -1) throw new Error(`No '{' after marker: ${marker}`);

  let i = firstBraceIdx;
  let depth = 0;

  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;
  let inLineComment = false;
  let inBlockComment = false;
  let escape = false;

  for (; i < source.length; i++) {
    const ch = source[i];
    const next = source[i + 1];

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
        return source.slice(firstBraceIdx, i + 1);
      }
    }
  }

  throw new Error(`Unbalanced braces while extracting object after: ${marker}`);
}

function extractVariations(htmlSource) {
  const markers = ['const VARIATIONS', 'let VARIATIONS', 'var VARIATIONS', 'VARIATIONS'];
  let lastError = null;
  for (const marker of markers) {
    try {
      const objLiteral = findObjectLiteralAfter(htmlSource, marker);
      const sandbox = { VARIATIONS: undefined };
      vm.createContext(sandbox);
      vm.runInContext(`VARIATIONS = ${objLiteral};`, sandbox, { timeout: 1000 });
      if (!sandbox.VARIATIONS || typeof sandbox.VARIATIONS !== 'object') {
        throw new Error('VARIATIONS not evaluated to object');
      }
      return sandbox.VARIATIONS;
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError || new Error('VARIATIONS not found');
}

function validateFen(fen) {
  try {
    // Chess() throws on invalid FEN in chess.js
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

  if (!Array.isArray(variation.moves)) {
    problems.push('moves is not an array');
    return { key, ok: false, problems };
  }

  const game = new Chess(variation.fen);
  for (let i = 0; i < variation.moves.length; i++) {
    const moveStr = variation.moves[i];
    const move = game.move(moveStr, { sloppy: true });
    if (!move) {
      problems.push(`illegal move at index ${i}: ${moveStr} (turn ${game.turn()})`);
      break;
    }
  }

  return { key, ok: problems.length === 0, problems };
}

let variations;
try {
  variations = extractVariations(html);
} catch (e) {
  console.error('Failed to extract VARIATIONS. If this page builds VARIATIONS dynamically, use browser console validation.');
  console.error('Details:', e.message || String(e));
  process.exit(1);
}

let hasErrors = false;
Object.keys(variations).forEach((key) => {
  const result = validateVariation(key, variations[key]);
  if (!result.ok) {
    hasErrors = true;
    console.log('[' + result.key + ']');
    result.problems.forEach((problem) => console.log('  - ' + problem));
  }
});

if (!hasErrors) {
  console.log('All variations valid');
}
