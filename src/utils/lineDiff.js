const normalizeLine = (line, ignoreWhitespace) =>
    ignoreWhitespace ? line.replace(/\s+/g, "") : line;

export const splitLines = (text) => {
    const lines = text.split(/\r\n|\n|\r/);
    if (text !== "" && lines.at(-1) === "") lines.pop();
    return lines;
};

export const buildLineDiff = (
    leftText,
    rightText,
    ignoreWhitespace = false,
) => {
    const leftLines = splitLines(leftText);
    const rightLines = splitLines(rightText);
    if (leftLines.length > 500 || rightLines.length > 500) {
        throw new Error("Compare up to 500 lines on each side.");
    }

    const normalizedLeft = leftLines.map((line) =>
        normalizeLine(line, ignoreWhitespace),
    );
    const normalizedRight = rightLines.map((line) =>
        normalizeLine(line, ignoreWhitespace),
    );
    const rowsBelow = Array.from(
        { length: leftLines.length + 1 },
        () => new Uint16Array(rightLines.length + 1),
    );

    for (let leftIndex = leftLines.length - 1; leftIndex >= 0; leftIndex -= 1) {
        for (
            let rightIndex = rightLines.length - 1;
            rightIndex >= 0;
            rightIndex -= 1
        ) {
            rowsBelow[leftIndex][rightIndex] =
                normalizedLeft[leftIndex] === normalizedRight[rightIndex]
                    ? rowsBelow[leftIndex + 1][rightIndex + 1] + 1
                    : Math.max(
                          rowsBelow[leftIndex + 1][rightIndex],
                          rowsBelow[leftIndex][rightIndex + 1],
                      );
        }
    }

    const rows = [];
    let leftIndex = 0;
    let rightIndex = 0;
    let additions = 0;
    let removals = 0;
    let unchanged = 0;

    while (leftIndex < leftLines.length || rightIndex < rightLines.length) {
        if (
            leftIndex < leftLines.length &&
            rightIndex < rightLines.length &&
            normalizedLeft[leftIndex] === normalizedRight[rightIndex]
        ) {
            rows.push({
                type: "same",
                left: leftLines[leftIndex],
                right: rightLines[rightIndex],
                leftNumber: leftIndex + 1,
                rightNumber: rightIndex + 1,
            });
            leftIndex += 1;
            rightIndex += 1;
            unchanged += 1;
        } else if (
            leftIndex < leftLines.length &&
            (rightIndex >= rightLines.length ||
                rowsBelow[leftIndex + 1][rightIndex] >=
                    rowsBelow[leftIndex][rightIndex + 1])
        ) {
            rows.push({
                type: "remove",
                left: leftLines[leftIndex],
                right: "",
                leftNumber: leftIndex + 1,
                rightNumber: null,
            });
            leftIndex += 1;
            removals += 1;
        } else {
            rows.push({
                type: "add",
                left: "",
                right: rightLines[rightIndex],
                leftNumber: null,
                rightNumber: rightIndex + 1,
            });
            rightIndex += 1;
            additions += 1;
        }
    }

    return { rows, additions, removals, unchanged };
};

export const formatDiffText = (rows) =>
    rows
        .map((row) => {
            if (row.type === "add") return `+ ${row.right}`;
            if (row.type === "remove") return `- ${row.left}`;
            return `  ${row.left}`;
        })
        .join("\n");
