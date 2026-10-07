import assert from "node:assert/strict";
import test from "node:test";
import { buildLineDiff, formatDiffText } from "../src/utils/lineDiff.js";

test("marks changed lines and keeps shared context", () => {
    const result = buildLineDiff("alpha\nbeta\ngamma", "alpha\nbeta two\ngamma");
    assert.equal(result.additions, 1);
    assert.equal(result.removals, 1);
    assert.equal(result.unchanged, 2);
    assert.deepEqual(result.rows.map((row) => row.type), ["same", "remove", "add", "same"]);
});

test("can ignore whitespace differences without ignoring case", () => {
    const result = buildLineDiff("  const title = 'Page';", "const title='Page';", true);
    assert.equal(result.additions, 0);
    assert.equal(result.removals, 0);
    assert.equal(result.unchanged, 1);
    assert.equal(buildLineDiff("Name", "name", true).additions, 1);
});

test("formats a copyable patch", () => {
    const result = buildLineDiff("old line", "new line");
    assert.equal(formatDiffText(result.rows), "- old line\n+ new line");
});

test("rejects inputs beyond the line limit", () => {
    assert.throws(() => buildLineDiff(Array(502).fill("line").join("\n"), "line"), /500 lines/);
});
