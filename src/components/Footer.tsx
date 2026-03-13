export function Footer() {
    return (
        <footer className="pt-32 pb-10 px-6 max-w-[1400px] mx-auto border-t border-borderDark mt-10">
            <div className="flex flex-col items-center text-center reveal">
                <div className="w-16 h-16 rounded-full overflow-hidden img-placeholder mb-8 border border-borderDark">
                    {/* Small Avatar Placeholder */}
                    <i className="ph-fill ph-user text-2xl text-textMuted"></i>
                    {/* <img src="your-photo.jpg" className="absolute inset-0 w-full h-full object-cover"> */}
                </div>

                <h2 className="text-[10vw] md:text-[8vw] font-black tracking-tighter leading-none mb-8 uppercase hover:text-textMuted transition-colors cursor-pointer">
                    Let's Talk!
                </h2>

                <a href="mailto:Uabdul88@gmail.com" className="px-8 py-4 bg-white text-black font-bold rounded-full text-lg hover:scale-105 transition-transform">
                    Uabdul88@gmail.com
                </a>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center mt-32 pt-8 border-t border-borderDark text-sm text-textMuted">
                <p>&copy; 2026 Dan Usman. All Rights Reserved.</p>

                <div className="flex items-center gap-6 mt-4 md:mt-0">
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors uppercase font-medium">LinkedIn</a>
                    <a href="https://github.com/EmperorDa8" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors uppercase font-medium">GitHub</a>
                    <p className="uppercase font-medium">B.Sc. Computer Science (NOUN)</p>
                </div>
            </div>
        </footer>
    );
}
