export function Navigation() {
    return (
        <nav>
            <div className="nav-left">
                <a href="#bio">BIO</a>
                <a href="#work" className="active">WORK</a>
            </div>
            <div className="nav-right">
                <a href="https://github.com/EmperorDa8" target="_blank" style={{ marginRight: '1rem' }}>GITHUB</a>
                <a href="mailto:Uabdul88@gmail.com">CONTACT</a>
            </div>
        </nav>
    );
}
