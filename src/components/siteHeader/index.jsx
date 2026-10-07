import { useEffect, useRef, useState } from "react";
import { FaGithub } from "react-icons/fa6";
import { LuGitCompareArrows, LuMenu, LuX } from "react-icons/lu";
import styles from "./styles.module.css";

const navItems = [
    { label: "Versions", href: "#compare" },
    { label: "Comparison", href: "#diff" },
];

const SiteHeader = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const headerRef = useRef(null);

    useEffect(() => {
        const closeOutside = (event) => {
            if (!headerRef.current?.contains(event.target)) setMenuOpen(false);
        };
        const closeOnEscape = (event) => {
            if (event.key === "Escape") setMenuOpen(false);
        };
        document.addEventListener("pointerdown", closeOutside);
        document.addEventListener("keydown", closeOnEscape);
        return () => {
            document.removeEventListener("pointerdown", closeOutside);
            document.removeEventListener("keydown", closeOnEscape);
        };
    }, []);

    return (
        <header className={styles.siteHeader} ref={headerRef}>
            <div className={styles.headerInner}>
                <a className={styles.brand} href="#top"><span><LuGitCompareArrows aria-hidden="true" /></span>Diffroom</a>
                <nav className={`${styles.navigation} ${menuOpen ? styles.navigationOpen : ""}`} id="main-navigation" aria-label="Main navigation">
                    {navItems.map((item) => <a href={item.href} key={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>)}
                </nav>
                <div className={styles.actions}>
                    <a className={styles.repositoryLink} href="https://github.com/a2rp/code-diff-viewer" target="_blank" rel="noreferrer">
                        <FaGithub aria-hidden="true" /><span>Repository</span>
                    </a>
                    <button
                        className={styles.menuButton}
                        type="button"
                        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
                        aria-expanded={menuOpen}
                        aria-controls="main-navigation"
                        onClick={() => setMenuOpen((open) => !open)}
                    >
                        {menuOpen ? <LuX aria-hidden="true" /> : <LuMenu aria-hidden="true" />}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default SiteHeader;
