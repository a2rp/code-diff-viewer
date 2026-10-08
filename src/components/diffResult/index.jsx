import { LuCheck, LuCopy, LuGitCompareArrows } from "react-icons/lu";
import styles from "./styles.module.css";

const DiffResult = ({ rows, summary, copyMessage, onCopy, error }) => (
    <section
        className={styles.diffResult}
        id="diff"
        aria-labelledby="diff-title"
    >
        <div className={styles.resultHeader}>
            <div className={styles.resultTitle}>
                <span className={styles.diffIcon}>
                    <LuGitCompareArrows aria-hidden="true" />
                </span>
                <div>
                    <h2 id="diff-title">Comparison</h2>
                    <p>Line-by-line changes</p>
                </div>
            </div>
            {!error && (
                <div className={styles.changeStats} aria-label="Change counts">
                    <span className={styles.addCount}>
                        +{summary.additions} added
                    </span>
                    <span className={styles.removeCount}>
                        -{summary.removals} removed
                    </span>
                    <span className={styles.sameCount}>
                        {summary.unchanged} unchanged
                    </span>
                </div>
            )}
            <button
                className={styles.copyButton}
                type="button"
                disabled={Boolean(error) || rows.length === 0}
                onClick={onCopy}
            >
                {copyMessage ? (
                    <LuCheck aria-hidden="true" />
                ) : (
                    <LuCopy aria-hidden="true" />
                )}
                {copyMessage || "Copy diff"}
            </button>
        </div>
        {error ? (
            <div className={styles.errorState} role="alert">
                {error}
            </div>
        ) : rows.length === 0 ? (
            <div className={styles.emptyState}>
                <p>Add text in both editors to compare versions.</p>
            </div>
        ) : summary.additions === 0 && summary.removals === 0 ? (
            <div className={styles.noChanges}>
                The two versions have no line changes.
            </div>
        ) : null}
        {!error && rows.length > 0 && (
            <div
                className={styles.diffScroll}
                role="list"
                aria-label="Line changes"
            >
                {rows.map((row) => (
                    <div
                        className={`${styles.diffRow} ${row.type === "add" ? styles.addRow : row.type === "remove" ? styles.removeRow : ""}`}
                        key={`${row.type}-${row.leftNumber ?? "x"}-${row.rightNumber ?? "x"}`}
                        role="listitem"
                    >
                        <span
                            className={styles.changeMarker}
                            aria-label={
                                row.type === "add"
                                    ? "Added"
                                    : row.type === "remove"
                                      ? "Removed"
                                      : "Unchanged"
                            }
                        >
                            {row.type === "add"
                                ? "+"
                                : row.type === "remove"
                                  ? "−"
                                  : " "}
                        </span>
                        <span className={styles.lineNumber}>
                            {row.leftNumber ?? ""}
                        </span>
                        <code className={styles.leftCode}>
                            {row.left || " "}
                        </code>
                        <span className={styles.lineNumber}>
                            {row.rightNumber ?? ""}
                        </span>
                        <code className={styles.rightCode}>
                            {row.right || " "}
                        </code>
                    </div>
                ))}
            </div>
        )}
        <p className={styles.copyStatus} aria-live="polite">
            {copyMessage}
        </p>
    </section>
);

export default DiffResult;
