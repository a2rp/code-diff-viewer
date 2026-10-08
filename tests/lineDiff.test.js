import assert from "node:assert/strict";
import test from "node:test";
import {
    buildLineDiff,
    formatDiffText,
    splitLines,
} from "../src/utils/lineDiff.js";

test("marks changed lines and keeps shared context", () => {
    const result = buildLineDiff(
        "alpha\nbeta\ngamma",
        "alpha\nbeta two\ngamma",
    );
    assert.equal(result.additions, 1);
    assert.equal(result.removals, 1);
    assert.equal(result.unchanged, 2);
    assert.deepEqual(
        result.rows.map((row) => row.type),
        ["same", "remove", "add", "same"],
    );
});

test("can ignore whitespace differences without ignoring case", () => {
    const result = buildLineDiff(
        "  const title = 'Page';",
        "const title='Page';",
        true,
    );
    assert.equal(result.additions, 0);
    assert.equal(result.removals, 0);
    assert.equal(result.unchanged, 1);
    assert.equal(buildLineDiff("Name", "name", true).additions, 1);
});

test("does not count a final newline as an extra blank line", () => {
    const result = buildLineDiff(
        "const greeting = \"Hello\";\nconsole.log(greeting);\nreturn greeting;",
        "const greeting = \"Hello, world\";\nconsole.info(greeting);\nreturn greeting;\n",
    );

    assert.equal(result.additions, 2);
    assert.equal(result.removals, 2);
    assert.equal(result.unchanged, 1);
    assert.equal(
        result.rows.some((row) => row.type === "add" && !row.right),
        false,
    );
    assert.equal(splitLines("first\nsecond\n").length, 2);
});

test("keeps intentional blank lines and recognizes CRLF input", () => {
    assert.deepEqual(splitLines("first\n\nsecond\n"), [
        "first",
        "",
        "second",
    ]);
    assert.deepEqual(splitLines("first\r\nsecond\r\n"), [
        "first",
        "second",
    ]);
});

test("accepts 500 lines when the last line has a terminating newline", () => {
    const input = Array(500).fill("line").join("\n") + "\n";
    assert.equal(splitLines(input).length, 500);
    assert.doesNotThrow(() => buildLineDiff(input, input));
});

test("formats a copyable patch", () => {
    const result = buildLineDiff("old line", "new line");
    assert.equal(formatDiffText(result.rows), "- old line\n+ new line");
});

test("rejects inputs beyond the line limit", () => {
    assert.throws(
        () => buildLineDiff(Array(502).fill("line").join("\n"), "line"),
        /500 lines/,
    );
});
