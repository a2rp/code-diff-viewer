import { LuArrowLeftRight, LuCode, LuEraser } from "react-icons/lu";
import styles from "./styles.module.css";

const maxCharacters = 40000;

const DiffEditors = ({ leftText, rightText, onLeftChange, onRightChange, onSwap, ignoreWhitespace, onIgnoreWhitespaceChange }) => (
    <section className={styles.diffEditors} id="compare" aria-label="Text versions to compare">
        <div className={styles.editorToolbar}>
            <div className={styles.toolbarTitle}><LuCode aria-hidden="true" /><span>Versions</span><span className={styles.editableTag}>EDITABLE</span></div>
            <div className={styles.toolbarActions}>
                <label className={styles.whitespaceOption}>
                    <input type="checkbox" checked={ignoreWhitespace} onChange={(event) => onIgnoreWhitespaceChange(event.target.checked)} />
                    <span className={styles.checkboxMark} aria-hidden="true"><LuEraser /></span>
                    Ignore whitespace
                </label>
                <button className={styles.swapButton} type="button" onClick={onSwap}>
                    <LuArrowLeftRight aria-hidden="true" /> Swap versions
                </button>
            </div>
        </div>

        <div className={styles.editorGrid}>
            <div className={styles.editorPanel}>
                <div className={styles.editorHeading}>
                    <label htmlFor="original-text"><span className={styles.sideDot} /> Original</label>
                    <span>{leftText.split("\n").length} lines</span>
                </div>
                <textarea
                    id="original-text"
                    maxLength={maxCharacters}
                    spellCheck="false"
                    value={leftText}
                    onChange={(event) => onLeftChange(event.target.value)}
                    placeholder="Paste the original text or code here..."
                />
                <div className={styles.editorFooter}>{leftText.length.toLocaleString()} / {maxCharacters.toLocaleString()} characters</div>
            </div>
            <div className={`${styles.editorPanel} ${styles.updatedPanel}`}>
                <div className={styles.editorHeading}>
                    <label htmlFor="updated-text"><span className={`${styles.sideDot} ${styles.updatedDot}`} /> Updated</label>
                    <span>{rightText.split("\n").length} lines</span>
                </div>
                <textarea
                    id="updated-text"
                    maxLength={maxCharacters}
                    spellCheck="false"
                    value={rightText}
                    onChange={(event) => onRightChange(event.target.value)}
                    placeholder="Paste the updated text or code here..."
                />
                <div className={styles.editorFooter}>{rightText.length.toLocaleString()} / {maxCharacters.toLocaleString()} characters</div>
            </div>
        </div>
    </section>
);

export default DiffEditors;
