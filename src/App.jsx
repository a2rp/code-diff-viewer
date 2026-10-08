import { useMemo, useState } from "react";
import BackToTop from "./components/backToTop/index.jsx";
import DiffEditors from "./components/diffEditors/index.jsx";
import DiffResult from "./components/diffResult/index.jsx";
import SiteFooter from "./components/siteFooter/index.jsx";
import SiteHeader from "./components/siteHeader/index.jsx";
import styles from "./App.module.css";
import { buildLineDiff, formatDiffText } from "./utils/lineDiff.js";

const originalSample = `const greeting = "Hello";\nconsole.log(greeting);\nreturn greeting;`;
const updatedSample = `const greeting = "Hello, world";\nconsole.info(greeting);\nreturn greeting;\n`;

const App = () => {
    const [leftText, setLeftText] = useState(originalSample);
    const [rightText, setRightText] = useState(updatedSample);
    const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
    const [copyMessage, setCopyMessage] = useState("");
    const comparison = useMemo(() => {
        try {
            return {
                ...buildLineDiff(leftText, rightText, ignoreWhitespace),
                error: "",
            };
        } catch (error) {
            return {
                rows: [],
                additions: 0,
                removals: 0,
                unchanged: 0,
                error: error.message,
            };
        }
    }, [leftText, rightText, ignoreWhitespace]);

    const swapVersions = () => {
        setLeftText(rightText);
        setRightText(leftText);
    };

    const copyDiff = async () => {
        try {
            await navigator.clipboard.writeText(
                formatDiffText(comparison.rows),
            );
            setCopyMessage("Diff copied");
        } catch {
            setCopyMessage("Clipboard unavailable");
        }
        window.setTimeout(() => setCopyMessage(""), 1800);
    };

    return (
        <div className={styles.appShell} id="top">
            <SiteHeader />
            <main className={styles.mainContent}>
                <section className={styles.introduction}>
                    <div>
                        <h1>
                            See what changed.
                            <br />
                            <span>Line by line.</span>
                        </h1>
                        <p>
                            Compare two versions of text or code, then copy a
                            readable change summary.
                        </p>
                    </div>
                    <span className={styles.inputLimit}>
                        Up to 500 lines per version
                    </span>
                </section>
                <DiffEditors
                    leftText={leftText}
                    rightText={rightText}
                    onLeftChange={setLeftText}
                    onRightChange={setRightText}
                    onSwap={swapVersions}
                    ignoreWhitespace={ignoreWhitespace}
                    onIgnoreWhitespaceChange={setIgnoreWhitespace}
                />
                <DiffResult
                    rows={comparison.rows}
                    summary={comparison}
                    copyMessage={copyMessage}
                    onCopy={copyDiff}
                    error={comparison.error}
                />
                <p className={styles.localNote}>
                    Your text stays in this browser. Nothing is uploaded or
                    saved.
                </p>
            </main>
            <SiteFooter />
            <BackToTop />
        </div>
    );
};

export default App;
