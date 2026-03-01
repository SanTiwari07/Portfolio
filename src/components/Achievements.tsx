import React from 'react';

const Achievements: React.FC = () => {
    return (
        <div className="w-full">
            <div className="mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Achievements & <span className="text-blue-200 relative inline-block">
                        Hackathon Wins
                        <span className="absolute bottom-1 left-0 w-full h-[2px] bg-blue-500/50 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
                    </span>
                </h2>
                <p className="mono text-sm text-gray-400">
                    Turning ideas into real-world AI solutions.
                </p>
            </div>

            <div className="flex flex-col gap-10">
                {/* Card 1 */}
                <div className="glass p-8 md:p-10 rounded-2xl border border-white/10 transition duration-300 hover:-translate-y-1 hover:neon-glow relative flex flex-col lg:flex-row gap-8 lg:gap-14">
                    {/* Left Sidebar - Meta & Title */}
                    <div className="lg:w-1/3 flex flex-col shrink-0 border-b lg:border-b-0 lg:border-r border-white/10 pb-6 lg:pb-0 lg:pr-8">
                        <div className="flex flex-wrap gap-3 mb-6">
                            <span className="bg-blue-500/20 text-blue-200 rounded-full px-4 py-1.5 text-xs font-semibold border border-blue-500/20">
                                1st Rank / 700+ Teams
                            </span>
                            <span className="bg-emerald-500/10 text-emerald-300 rounded-full px-4 py-1.5 text-xs font-semibold border border-emerald-500/20">
                                ₹1,00,000 Prize
                            </span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">TechFiesta ’26</h3>
                        <p className="text-blue-200/80 font-medium mb-4 tracking-wide text-sm md:text-base uppercase">International Hackathon</p>
                        <p className="text-sm text-gray-400 mt-auto leading-relaxed hidden lg:block">
                            Award-winning AI-driven agriculture platform solving real farmer-level challenges through Generative AI and Computer Vision.
                        </p>
                    </div>

                    {/* Right Content */}
                    <div className="lg:w-2/3 flex flex-col justify-center">
                        <ul className="space-y-4 text-sm text-gray-300 mb-8 list-none">
                            <li className="flex gap-4 items-start">
                                <span className="text-blue-500 mt-0.5 text-lg leading-none">▹</span>
                                <span className="leading-relaxed">Built <strong>KrishiSahAI Advisory</strong>, an AI-driven agriculture platform solving real farmer-level challenges.</span>
                            </li>
                            <li className="flex gap-4 items-start">
                                <span className="text-blue-500 mt-0.5 text-lg leading-none">▹</span>
                                <span className="leading-relaxed">Designed the system architecture connecting Generative AI, Computer Vision, and real-time environmental data.</span>
                            </li>
                            <li className="flex gap-4 items-start">
                                <span className="text-blue-500 mt-0.5 text-lg leading-none">▹</span>
                                <span className="leading-relaxed">Developed precision disease/pest detection models and a waste-to-value LLM engine.</span>
                            </li>
                            <li className="flex gap-4 items-start">
                                <span className="text-blue-500 mt-0.5 text-lg leading-none">▹</span>
                                <span className="leading-relaxed">Implemented a multilingual conversational interface scalable for enterprise and government deployment.</span>
                            </li>
                        </ul>

                        <div className="bg-white/5 rounded-xl p-6 border border-white/5 relative overflow-hidden group-hover:bg-blue-500/5 transition-colors duration-300">
                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50"></div>
                            <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Outcome
                            </h4>
                            <p className="text-sm text-gray-300 leading-relaxed">
                                Secured 1st Rank among 700+ national and international teams. Awarded ₹1,00,000. Recognized for real-world viability and potential to increase farmer income by 30-50%.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="glass p-8 md:p-10 rounded-2xl border border-white/10 transition duration-300 hover:-translate-y-1 hover:neon-glow relative flex flex-col lg:flex-row gap-8 lg:gap-14">
                    {/* Left Sidebar - Meta & Title */}
                    <div className="lg:w-1/3 flex flex-col shrink-0 border-b lg:border-b-0 lg:border-r border-white/10 pb-6 lg:pb-0 lg:pr-8">
                        <div className="flex flex-wrap gap-3 mb-6">
                            <span className="bg-blue-500/20 text-blue-200 rounded-full px-4 py-1.5 text-xs font-semibold border border-blue-500/20">
                                Top 3 Finisher
                            </span>
                            <span className="bg-emerald-500/10 text-emerald-300 rounded-full px-4 py-1.5 text-xs font-semibold border border-emerald-500/20">
                                ₹2,00,000 Prize
                            </span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">VOIS Innovation</h3>
                        <p className="text-blue-200/80 font-medium mb-4 tracking-wide text-sm md:text-base uppercase">Marathon 2.0</p>
                        <p className="text-sm text-gray-400 mt-auto leading-relaxed hidden lg:block">
                            AI and Blockchain "Phygital" platform designed to revolutionize Indian agriculture with Green Credit Marketplaces.
                        </p>
                    </div>

                    {/* Right Content */}
                    <div className="lg:w-2/3 flex flex-col justify-center">
                        <ul className="space-y-4 text-sm text-gray-300 mb-8 list-none">
                            <li className="flex gap-4 items-start">
                                <span className="text-blue-500 mt-0.5 text-lg leading-none">▹</span>
                                <span className="leading-relaxed">Developed <strong>KrishiSaarthi</strong>, an AI & Blockchain "Phygital" platform for Indian agriculture.</span>
                            </li>
                            <li className="flex gap-4 items-start">
                                <span className="text-blue-500 mt-0.5 text-lg leading-none">▹</span>
                                <span className="leading-relaxed">Created the AI Disease Detector (Crop Doctor) using Deep Learning (MobileNetV2/ResNet).</span>
                            </li>
                            <li className="flex gap-4 items-start">
                                <span className="text-blue-500 mt-0.5 text-lg leading-none">▹</span>
                                <span className="leading-relaxed">Designed a Blockchain-based Green Credit Marketplace with Ethereum/Polygon smart contracts.</span>
                            </li>
                            <li className="flex gap-4 items-start">
                                <span className="text-blue-500 mt-0.5 text-lg leading-none">▹</span>
                                <span className="leading-relaxed">Integrated local LLM processing (Ollama) for an AI-powered Waste-to-Value recommendation engine.</span>
                            </li>
                        </ul>

                        <div className="bg-white/5 rounded-xl p-6 border border-white/5 relative overflow-hidden group-hover:bg-blue-500/5 transition-colors duration-300">
                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50"></div>
                            <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Impact
                            </h4>
                            <p className="text-sm text-gray-300 leading-relaxed">
                                Selected among Top 3 out of 630+ teams. Awarded ₹2,00,000. Validated through "Phase Zero" ground research directly with local farmers.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Achievements;
