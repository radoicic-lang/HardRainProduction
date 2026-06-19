import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Pause, 
  Sparkles, 
  Sliders, 
  Compass, 
  Layers, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Clock, 
  Tv, 
  Camera, 
  UserCheck, 
  User, 
  HelpCircle, 
  Maximize2, 
  MapPin, 
  Calendar, 
  DollarSign, 
  ChevronRight, 
  Zap, 
  AlertCircle,
  FileCheck,
  RotateCcw,
  Mail,
  Phone,
  Video
} from "lucide-react";
import { PORTFOLIO_DATA, ACTIVE_PROJECTS_DATA, AGENT_MANIFEST_DATA } from "./data";
import { ClientLogoCarousel } from "./components/ClientLogoCarousel";
import { PortfolioItem, ActiveProject, ReviewComment, Milestone } from "./types";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Navigation & Screen States
  const [activeTab, setActiveTab] = useState<string>("portfolio");
  const [hasScrolled, setHasScrolled] = useState(false);

  // Dynamic Background / Bandwidth Speed State
  const [connectionSpeed, setConnectionSpeed] = useState<"ultra" | "balanced" | "restricted">("ultra");
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);

  // Intelligent Hero Reel Rotation Configuration
  const [referralSource, setReferralSource] = useState<"direct" | "linkedin" | "festival" | "records">("direct");
  const [selectedHeroItem, setSelectedHeroItem] = useState<PortfolioItem>(PORTFOLIO_DATA[0]);

  // Portfolio States
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(PORTFOLIO_DATA);
  const [portfolioCategory, setPortfolioCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPortfolioItem, setSelectedPortfolioItem] = useState<PortfolioItem | null>(null);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  // Dynamically fetch Vimeo titles/metadata and update throughout the website
  useEffect(() => {
    const fetchVimeoMetadata = async () => {
      let changed = false;
      const updatedItems = [...portfolioItems];

      await Promise.all(
        updatedItems.map(async (item, index) => {
          if (item.vimeoVideoId) {
            try {
              const response = await fetch(
                `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${item.vimeoVideoId}`
              );
              if (response.ok) {
                const data = await response.json();
                if (data.title && updatedItems[index].title !== data.title) {
                  updatedItems[index] = {
                    ...updatedItems[index],
                    title: data.title.replace(/&amp;/g, "&").toUpperCase(),
                    synopsis: data.description || updatedItems[index].synopsis,
                  };
                  changed = true;
                }
              }
            } catch (error) {
              console.error("Error fetching Vimeo metadata for video ID:", item.vimeoVideoId, error);
            }
          }
        })
      );

      if (changed) {
        setPortfolioItems(updatedItems);
        // Sync selectedHeroItem if it matches
        setSelectedHeroItem((prevHero) => {
          const matched = updatedItems.find((itm) => itm.id === prevHero.id);
          return matched ? matched : prevHero;
        });
        // Sync selectedPortfolioItem if active in modal
        setSelectedPortfolioItem((prevSel) => {
          if (!prevSel) return null;
          const matched = updatedItems.find((itm) => itm.id === prevSel.id);
          return matched ? matched : prevSel;
        });
      }
    };

    fetchVimeoMetadata();
  }, []);


  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update Hero based on Intelligent Reel Rotation Simulation
  useEffect(() => {
    switch (referralSource) {
      case "linkedin":
        // corporate/commercial oriented Tech Group release
        setSelectedHeroItem(portfolioItems[0]);
        break;
      case "festival":
        // artistic science fiction narrative film
        setSelectedHeroItem(portfolioItems[1]);
        break;
      case "records":
        // flashy neon Tokyo music video
        setSelectedHeroItem(portfolioItems[2]);
        break;
      default:
        // default stellar main showcase
        setSelectedHeroItem(portfolioItems[0]);
        break;
    }
  }, [referralSource, portfolioItems]);



  // Search keyword matcher for Portfolio Tagging
  const filteredPortfolio = portfolioItems.filter((item) => {
    // 1. Matches Category filter
    const matchesCategory = portfolioCategory === "All" || item.category === portfolioCategory;
    
    // 2. Matches client-side typed queries
    if (!searchQuery.trim()) return matchesCategory;
    
    const query = searchQuery.toLowerCase();
    
    // Check various descriptive vectors in metadata
    const matchScore = 
      item.title.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.cameraPackage.toLowerCase().includes(query) ||
      item.synopsis.toLowerCase().includes(query) ||
      item.lensesUsed.toLowerCase().includes(query) ||
      item.director.toLowerCase().includes(query) ||
      item.role.toLowerCase().includes(query) ||
      item.budgetGrade.toLowerCase().includes(query);
      
    return matchesCategory && matchScore;
  });


  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] font-sans selection:bg-blue-600/10 selection:text-black overflow-x-hidden antialiased">
      
      {/* FIXED TOP HEADER / SMART NAV */}
      <nav 
        id="navbar-root" 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          hasScrolled 
            ? "bg-white/90 backdrop-blur-md pt-3 pb-3 border-zinc-200/70 shadow-[0_2px_15px_rgba(0,0,0,0.02)]" 
            : "bg-transparent pt-6 pb-4 border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center font-sans">
          {/* Studio Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="h-10 w-10 relative overflow-hidden rounded-full border border-blue-500/25 shadow-md bg-zinc-950">
              <img 
                src="https://i.vimeocdn.com/portrait/122280093_288x288?subrect=0%2C0%2C499%2C499&r=cover&sig=1e999a8ff4532f26453fda4a25ef6cc1975fd035df4523af5f138d6507ef7d00&v=1&region=us" 
                alt="HARD RAIN Logo" 
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover select-none"
              />
            </div>
            <div>
              <span className={`font-display font-bold text-base tracking-widest transition-colors duration-300 ${
                hasScrolled ? "text-zinc-900" : "text-white"
              }`}>HARD RAIN</span>
              <span className={`hidden sm:inline font-mono text-[9px] ml-2 tracking-widest uppercase transition-colors duration-300 ${
                hasScrolled ? "text-zinc-500" : "text-zinc-400"
              }`}>PRODUCTIONS // SAN DIEGO</span>
            </div>
          </div>

          {/* Nav Items */}
          <div className={`hidden md:flex items-center gap-1 p-1 rounded-full border transition-all duration-300 ${
            hasScrolled 
              ? "bg-zinc-100/80 border-zinc-200/80" 
              : "bg-zinc-950/40 border-zinc-800/60"
          }`}>
            <button onClick={() => { setActiveTab("partners"); document.getElementById("partners-section")?.scrollIntoView({ behavior: "smooth" }); }} className={`px-4 py-1.5 rounded-full text-[11px] font-mono tracking-wider transition-all duration-300 ${activeTab === "partners" ? (hasScrolled ? "bg-white text-black font-semibold shadow-[0_1px_4px_rgba(0,0,0,0.06)]" : "bg-white text-black font-semibold") : (hasScrolled ? "text-zinc-500 hover:text-black" : "text-zinc-400 hover:text-white")}`}>
              TRUSTED PARTNERS
            </button>
            <button onClick={() => { setActiveTab("about"); document.getElementById("about-section")?.scrollIntoView({ behavior: "smooth" }); }} className={`px-4 py-1.5 rounded-full text-[11px] font-mono tracking-wider transition-all duration-300 ${activeTab === "about" ? (hasScrolled ? "bg-white text-black font-semibold shadow-[0_1px_4px_rgba(0,0,0,0.06)]" : "bg-white text-black font-semibold") : (hasScrolled ? "text-zinc-500 hover:text-black" : "text-zinc-400 hover:text-white")}`}>
              ABOUT
            </button>
            <button onClick={() => { setActiveTab("portfolio"); document.getElementById("portfolio-section")?.scrollIntoView({ behavior: "smooth" }); }} className={`px-4 py-1.5 rounded-full text-[11px] font-mono tracking-wider transition-all duration-300 ${activeTab === "portfolio" ? (hasScrolled ? "bg-white text-black font-semibold shadow-[0_1px_4px_rgba(0,0,0,0.06)]" : "bg-white text-black font-semibold") : (hasScrolled ? "text-zinc-500 hover:text-black" : "text-zinc-400 hover:text-white")}`}>
              PORTFOLIO
            </button>
            <button onClick={() => { setActiveTab("services"); document.getElementById("services-section")?.scrollIntoView({ behavior: "smooth" }); }} className={`px-4 py-1.5 rounded-full text-[11px] font-mono tracking-wider transition-all duration-300 ${activeTab === "services" ? (hasScrolled ? "bg-white text-black font-semibold shadow-[0_1px_4px_rgba(0,0,0,0.06)]" : "bg-white text-black font-semibold") : (hasScrolled ? "text-zinc-500 hover:text-black" : "text-zinc-400 hover:text-white")}`}>
              SERVICES
            </button>
            <button onClick={() => { setActiveTab("faq"); document.getElementById("faq-section")?.scrollIntoView({ behavior: "smooth" }); }} className={`px-4 py-1.5 rounded-full text-[11px] font-mono tracking-wider transition-all duration-300 ${activeTab === "faq" ? (hasScrolled ? "bg-white text-black font-semibold shadow-[0_1px_4px_rgba(0,0,0,0.06)]" : "bg-white text-black font-semibold") : (hasScrolled ? "text-zinc-500 hover:text-black" : "text-zinc-400 hover:text-white")}`}>
              FAQ
            </button>
            <button onClick={() => { setActiveTab("vision"); document.getElementById("vision-statement-section")?.scrollIntoView({ behavior: "smooth" }); }} className={`px-4 py-1.5 rounded-full text-[11px] font-mono tracking-wider transition-all duration-300 ${activeTab === "vision" ? (hasScrolled ? "bg-white text-black font-semibold shadow-[0_1px_4px_rgba(0,0,0,0.06)]" : "bg-white text-black font-semibold") : (hasScrolled ? "text-zinc-500 hover:text-black" : "text-zinc-400 hover:text-white")}`}>
              VISION
            </button>
            <button onClick={() => { setActiveTab("equipment"); document.getElementById("equipment-section")?.scrollIntoView({ behavior: "smooth" }); }} className={`px-4 py-1.5 rounded-full text-[11px] font-mono tracking-wider transition-all duration-300 ${activeTab === "equipment" ? (hasScrolled ? "bg-white text-black font-semibold shadow-[0_1px_4px_rgba(0,0,0,0.06)]" : "bg-white text-black font-semibold") : (hasScrolled ? "text-zinc-500 hover:text-black" : "text-zinc-400 hover:text-white")}`}>
              EQUIPMENT
            </button>
          </div>

          {/* Sticky CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                document.getElementById("contact-section")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-5 py-2 hover:bg-blue-700 text-white bg-blue-600 border-blue-600 rounded-full text-xs font-mono tracking-wider font-semibold shadow-md animate-pulse-blue cursor-pointer transition-all duration-300"
            >
              CONTACT US
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION / THE IMMERSIVE "HOOK" */}
      <header id="hero-heading" className="relative min-h-screen flex flex-col justify-between pt-24 pb-8 px-4 md:px-8 overflow-hidden z-10 border-b border-zinc-900 bg-gradient-to-b from-black via-zinc-950 to-[#070709]">
        
        {/* Full-bleed background viewport (Actual Vimeo background video loop) */}
        <div className="absolute inset-0 z-0 pointer-events-none transition-all duration-700 overflow-hidden">
          {selectedHeroItem.vimeoVideoId ? (
            <div className="absolute inset-0 w-full h-full scale-[1.12]">
              <iframe
                src={`https://player.vimeo.com/video/${selectedHeroItem.vimeoVideoId}?background=1&autoplay=1&loop=1&byline=0&portrait=0&title=0&muted=1&quality=1080p`}
                className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 aspect-[16/9] min-w-full min-h-full object-cover pointer-events-none"
                allow="autoplay; fullscreen"
                title={selectedHeroItem.title}
              />
            </div>
          ) : (
            <>
              {connectionSpeed === "ultra" && (
                <div className="absolute inset-0 bg-cover bg-center animate-pulse transition-all duration-1000" style={{ backgroundImage: `url(${selectedHeroItem.thumbnailUrl})` }} />
              )}
              {connectionSpeed === "balanced" && (
                <div className="absolute inset-0 bg-cover bg-center grayscale-50 scale-102 transition-all duration-700" style={{ backgroundImage: `url(${selectedHeroItem.thumbnailUrl})` }} />
              )}
              {connectionSpeed === "restricted" && (
                <div className="absolute inset-0 bg-cover bg-center contrast-[0.8] blur-sm transition-all duration-500" style={{ backgroundImage: `url(${selectedHeroItem.thumbnailUrl})` }} />
              )}
            </>
          )}
          {/* Futuristic ambient vignette mask */}
        </div>

        {/* TOP LINE INTRODUCTIONS */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col justify-center items-start mt-12 gap-8">
          

        {/* Studio Hook (Moved) */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col justify-center items-end mt-[500px] gap-8">
           <div className="p-8 bg-zinc-900/50 backdrop-blur-sm rounded-3xl space-y-4 max-w-4xl text-right">
             <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-900/50 border border-zinc-800 text-zinc-400 text-[10px] font-mono rounded-full uppercase tracking-[0.2em]">
                ✧ CINEMATIC REEL SHOWCASE
             </div>
             <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight text-white leading-tight whitespace-nowrap">
               We Bring <span className="italic inline font-light text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-300">Vision to your ideas.</span>
             </h1>

             <div className="w-full text-left">
              <p className="text-white text-base md:text-lg leading-relaxed max-w-xl font-sans font-light">
                Stories that move people, from the screen to the soul.<br /> A prestigious, human-centric production studio embodying high-end craftsmanship and deep emotional impact.
              </p>
            </div>
           </div>
        </div>
        
        </div>
      </header>

      <div id="partners-section">
        <ClientLogoCarousel />
      </div>

      {/* ABOUT US & TEAM */}
      <section id="about-section" className="py-24 px-4 max-w-7xl mx-auto space-y-12">
        <div id="vision-section" className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
               <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest block">// OUR ETHOS & TEAM</span>
               <h2 className="text-4xl font-display font-bold tracking-tight text-zinc-900">BRINGING VISION TO LIFE</h2>
               <p className="text-zinc-600 leading-relaxed font-sans">Hard Rain Productions is a San Diego-based studio dedicated to bringing vision to life. We specialize in stories that move people—from the screen to the soul. We believe in high-end craftsmanship, visual storytelling, and the emotional impact of every frame.</p>
            </div>
            <div className="bg-zinc-100 p-8 rounded-3xl border border-zinc-200">
                <h3 className="text-xl font-display font-bold mb-4">Scott Bernstein, Founder/Producer</h3>
                <p className="text-zinc-600 font-sans leading-relaxed">Scott Bernstein brings a deep commitment to human-centric filmmaking. With a career rooted in both institutional trust and artistic narrative, Scott leads the studio’s mission to elevate every project through collaborative storytelling and technical precision.</p>
            </div>
        </div>
      </section>


      {/* CINEMATIC PORTFOLIO / THE "PROOF" */}
      <section id="portfolio-section" className="py-24 px-4 max-w-7xl mx-auto space-y-12 bg-zinc-900 rounded-3xl mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zinc-700 pb-8">
          <div className="space-y-3">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest block">// CINEMATIC PORTFOLIO INDEXING</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-white">SELECTED MASTERS</h2>
            <p className="text-zinc-300 text-sm max-w-md font-sans">Curated commercial films and narrative treatments. Use tag parameters to search instantly.</p>
          </div>

          {/* Search & Filters */}
          <div className="w-full md:w-auto space-y-4">
            
            {/* Semantic Query input */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search Portfolio (e.g. 'Arri Alexa Cooke')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-full text-xs font-mono text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition shadow-sm"
              />
              
            </div>

            {/* Normal category chips */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: "All", label: "ALL WORK" },
                { id: "The Impact", label: "THE IMPACT (Commercials)" },
                { id: "The Truth", label: "THE TRUTH (Documentaries)" },
                { id: "The Craft", label: "THE CRAFT (Narrative)" }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setPortfolioCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-[10px] font-mono tracking-wider transition-all duration-300 border ${
                    portfolioCategory === cat.id 
                      ? "bg-blue-600 text-white border-blue-600 font-medium shadow-md" 
                      : "bg-zinc-800 text-zinc-300 border-zinc-700 hover:text-blue-400 hover:border-zinc-600"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* PORTFOLIO GRID */}
        {filteredPortfolio.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-zinc-300 rounded-3xl max-w-lg mx-auto space-y-4 bg-white/70">
            <AlertCircle className="w-8 h-8 text-zinc-400 mx-auto" />
            <h3 className="font-display font-medium text-zinc-800 text-base">No Matching Cinematic Projects</h3>
            <p className="text-zinc-500 text-xs">Try searching for other active vectors like "Sony Venice", "Anamorphic", "independent", or "premium".</p>
            <button 
              onClick={() => { setSearchQuery(""); setPortfolioCategory("All"); }}
              className="px-4 py-2 bg-black text-white text-xs font-mono rounded-full hover:bg-neutral-800 transition"
            >
              Reset Search & Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredPortfolio.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => setSelectedPortfolioItem(item)}
                  className="group bg-white border border-zinc-200/80 hover:border-zinc-300 rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer shadow-sm hover:shadow-[0_15px_45px_rgba(0,0,0,0.04)] flex flex-col justify-between"
                >
                  <div className="relative aspect-[2.39/1] overflow-hidden bg-black">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-75" />
                    
                    {/* Hover Play/Vimeo Indicator Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40 backdrop-blur-[2px]">
                      <div className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 scale-95 group-hover:scale-100 transition-transform duration-300 rounded-full font-mono text-[9px] text-white tracking-widest shadow-lg">
                        <span>▶ WATCH MASTERPIECE</span>
                      </div>
                    </div>

                    {/* Top Aspect Tag */}
                    <span className="absolute top-3 right-3 text-[10px] font-mono tracking-widest px-2 py-0.5 bg-black/70 rounded border border-white/10 text-white z-10">
                      {item.aspectRatio}
                    </span>
                    
                    {/* Widescreen cinematic bars simulator */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-black" />
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black" />
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                        <span>CLIENT: {item.client.toUpperCase()}</span>
                        <span>{item.videoDuration} MIN</span>
                      </div>
                      <h3 className="text-xl font-display font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                    </div>

                    <p className="text-zinc-500 text-xs line-clamp-2 leading-relaxed">
                      {item.synopsis}
                    </p>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      <span className="text-[10px] font-mono bg-zinc-50 px-2 py-1 rounded-md text-zinc-650 border border-zinc-200">
                        🎥 {item.cameraPackage}
                      </span>
                      <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-1 rounded-md border border-blue-100">
                        💎 {item.budgetGrade}
                      </span>
                      <span className="text-[10px] font-mono bg-zinc-50 text-zinc-700 px-2 py-1 rounded-md border border-zinc-200">
                        {item.role}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

      </section>

      {/* PORTFOLIO LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedPortfolioItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="relative aspect-[2.39/1] bg-black">
                {selectedPortfolioItem.vimeoVideoId ? (
                  <iframe
                    src={`https://player.vimeo.com/video/${selectedPortfolioItem.vimeoVideoId}?autoplay=1&title=0&byline=0&portrait=0`}
                    className="w-full h-full absolute inset-0 border-0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title={selectedPortfolioItem.title}
                  />
                ) : (
                  <>
                    <img
                      src={selectedPortfolioItem.thumbnailUrl}
                      alt={selectedPortfolioItem.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
                  </>
                )}
                
                {/* Widescreen bars */}
                <div className="absolute top-0 left-0 right-0 h-4 bg-black/60 pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-4 bg-black/60 pointer-events-none" />

                {/* Close Button */}
                <button
                  onClick={() => setSelectedPortfolioItem(null)}
                  className="absolute top-6 right-6 h-8 w-8 rounded-full bg-black/80 hover:bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 text-sm transition cursor-pointer z-10"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 md:p-8 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-zinc-400">{selectedPortfolioItem.category.toUpperCase()} // RELEASE {selectedPortfolioItem.releaseYear}</span>
                    <h2 className="text-2xl md:text-3xl font-display font-medium text-white">{selectedPortfolioItem.title}</h2>
                  </div>
                  <span className="text-xs font-mono tracking-widest px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">
                    ROLE: {selectedPortfolioItem.role.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 border-t border-zinc-900">
                  {/* Left Column: Storytelling & Impact */}
                  <div className="lg:col-span-8 space-y-6">
                    {/* Emotional Project Story */}
                    {selectedPortfolioItem.projectStory && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">// PROJECT STORY (EMOTIONAL ARC)</span>
                        </div>
                        <p className="text-zinc-200 text-sm leading-relaxed font-sans">{selectedPortfolioItem.projectStory}</p>
                      </div>
                    )}

                    {/* SGE Optimized Synopsis */}
                    <div className="space-y-2 pt-2">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">// CORE SUMMARY SYNOPSIS</span>
                      <p className="text-zinc-400 text-xs leading-relaxed">{selectedPortfolioItem.synopsis}</p>
                    </div>

                    {/* Result / Business & Emotional Impact */}
                    {selectedPortfolioItem.resultImpact && (
                      <div className="p-5 bg-gradient-to-br from-blue-950/20 to-zinc-950/40 border border-blue-950/40 rounded-2xl space-y-2">
                        <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block font-bold">🎯 THE OUTCOME & IMPACT</span>
                        <p className="text-zinc-200 text-sm leading-relaxed font-sans">{selectedPortfolioItem.resultImpact}</p>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Collapsible Technical Log & Auto tags */}
                  <div className="lg:col-span-4 space-y-6">
                    {/* Collapsible Technical Craft Accordion */}
                    <div className="border border-zinc-805 border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900/10">
                      <button
                        onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                        className="w-full p-4 flex justify-between items-center bg-zinc-900/30 hover:bg-zinc-900/50 transition text-left cursor-pointer"
                      >
                        <span className="text-xs font-mono text-zinc-300 font-medium uppercase tracking-wide flex items-center gap-1.5">
                          ⚙️ TECHNICAL CRAFT DETAILS
                        </span>
                        <span className="text-xs text-blue-400 font-mono">
                          {showTechnicalDetails ? "[ HIDE ]" : "[ EXPAND ]"}
                        </span>
                      </button>

                      {showTechnicalDetails && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="p-4 border-t border-zinc-800/80 bg-black/60 font-mono text-xs space-y-3"
                        >
                          <div className="space-y-1.5 text-zinc-300">
                            <div className="flex justify-between pb-1 border-b border-zinc-950">
                              <span className="text-zinc-500">Camera System</span>
                              <span className="text-right font-medium text-zinc-200">{selectedPortfolioItem.cameraPackage}</span>
                            </div>
                            <div className="flex justify-between pb-1 border-b border-zinc-950">
                              <span className="text-zinc-500">Anamorphic Glasses</span>
                              <span className="text-right font-medium text-zinc-200">{selectedPortfolioItem.lensesUsed}</span>
                            </div>
                            <div className="flex justify-between pb-1 border-b border-zinc-950">
                              <span className="text-zinc-500">Color Workflow</span>
                              <span className="text-right font-medium text-blue-400">{selectedPortfolioItem.colorSpace}</span>
                            </div>
                            <div className="flex justify-between pb-1 border-b border-zinc-950">
                              <span className="text-zinc-500">Budget Bracket</span>
                              <span className="text-right font-medium text-indigo-400">{selectedPortfolioItem.budgetGrade}</span>
                            </div>
                            <div className="flex justify-between font-bold">
                              <span className="text-zinc-500">Aspect Ratio</span>
                              <span className="text-right font-medium text-zinc-200">{selectedPortfolioItem.aspectRatio}</span>
                            </div>
                          </div>

                          {selectedPortfolioItem.technicalCraftDetails && (
                            <div className="pt-3 border-t border-zinc-850 border-zinc-800 space-y-1">
                              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">Behind-The-Lens Systemics</span>
                              <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">{selectedPortfolioItem.technicalCraftDetails}</p>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>

                    {/* Thematic Analysis */}
                    {selectedPortfolioItem.moodTags && (
                      <div className="space-y-3 bg-zinc-950 border border-zinc-900 p-4 rounded-2xl">
                        <div className="flex items-center gap-1.5 justify-between">
                          <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold">✧ THEMATIC MOOD TAGS</span>
                          <span className="text-[8px] font-mono text-zinc-500">Curated Themes</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedPortfolioItem.moodTags.map((tag) => (
                            <span 
                              key={tag} 
                              className="text-[10px] font-mono px-2 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-300 rounded-md hover:bg-blue-500/15 hover:text-blue-200 transition"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <p className="text-[9px] text-zinc-500 leading-normal font-sans pt-1">
                          These curated key visual and emotional themes represent the heart of the project.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SERVICES & THE INTERACTIVE SCOPE BUILDER / GENERATIVE BRIEFER */}
      <section id="services-section" className="py-24 px-4 bg-white border-t border-b border-zinc-200/60 shadow-[inset_0_4px_30px_rgba(0,0,0,0.01)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Outlined outcome services */}
          <div className="lg:col-span-8 lg:col-start-3 space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest block">// PREMIUM SERVICE BLUEPRINTS</span>
              <h2 className="text-4xl font-display font-black text-zinc-900 tracking-tight leading-tight">BENEFITS FOCUSED SERVICES</h2>
              <p className="text-zinc-500 text-sm leading-relaxed font-sans">
                We deliver structured digital film commissions that ensure high aesthetic impact, stunning technical execution, and robust organic discoverability.
              </p>
            </div>

            <div className="space-y-6">
                <div className="p-6 border border-zinc-200/85 hover:border-zinc-300 bg-zinc-50/50 rounded-2xl space-y-3 transition shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-md">
                    <h3 className="font-display font-medium text-zinc-900 text-base md:text-lg">Commercial Production</h3>
                    <p className="text-zinc-650 text-xs leading-relaxed font-sans">Premium video content designed to establish brand authority and institutional trust.</p>
                </div>
                <div className="p-6 border border-zinc-200/85 hover:border-zinc-300 bg-zinc-50/50 rounded-2xl space-y-3 transition shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-md">
                    <h3 className="font-display font-medium text-zinc-900 text-base md:text-lg">Narrative Filmmaking</h3>
                    <p className="text-zinc-650 text-xs leading-relaxed font-sans">Artful storytelling, from short-form conceptual pieces to independent film development.</p>
                </div>
                <div className="p-6 border border-zinc-200/85 hover:border-zinc-300 bg-zinc-50/50 rounded-2xl space-y-3 transition shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-md">
                    <h3 className="font-display font-medium text-zinc-900 text-base md:text-lg">Documentary & Truth</h3>
                    <p className="text-zinc-650 text-xs leading-relaxed font-sans">Intimate, authentic documentary framing that captures the heart of community and mission-driven organizations.</p>
                </div>
                <div className="p-6 border border-zinc-200/85 hover:border-zinc-300 bg-zinc-50/50 rounded-2xl space-y-3 transition shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-md">
                    <h3 className="font-display font-medium text-zinc-900 text-base md:text-lg">Color & Craft</h3>
                    <p className="text-zinc-650 text-xs leading-relaxed font-sans">High-end post-production services utilizing ACES workflows, custom LUT configurations, and sophisticated color grading to ensure a signature visual aesthetic.</p>
                </div>
            </div>
            

            
            
            
          </div>
        </div>
      </section>



      {/* FAQ */}
      <section id="faq-section" className="py-24 px-4 max-w-4xl mx-auto space-y-12">
          <h2 className="text-4xl font-display font-bold tracking-tight text-zinc-900 text-center">FREQUENTLY ASKED QUESTIONS</h2>
          <div className="space-y-6">
              <div>
                  <h3 className="font-bold text-zinc-900">What is your production process?</h3>
                  <p className="text-zinc-600 text-sm">We follow a collaborative 'Project Builder' approach: Creative Concept &rarr; Pre-Production/Casting &rarr; Principal Photography &rarr; Post-Production &rarr; Client Review &rarr; Final Delivery.</p>
              </div>
               <div>
                  <h3 className="font-bold text-zinc-900">What type of clients do you work with?</h3>
                  <p className="text-zinc-600 text-sm">We partner with brands, sports franchises, non-profits, and independent artists who value premium cinematic quality.</p>
              </div>
               <div>
                  <h3 className="font-bold text-zinc-900">How do I get a quote?</h3>
                  <p className="text-zinc-600 text-sm">Use the 'Project Builder' tool on our site to describe your vision, or reach out directly through our contact form.</p>
              </div>
          </div>
      </section>


      {/* ABOUT / THE LEAD TEAM & MISSION */}
      <section id="vision-statement-section" className="py-24 px-4 bg-zinc-50/40 border-t border-zinc-200/80">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest block">// SITE MISSION STATEMENT & ABOUT US</span>
              <h2 className="text-4xl font-display font-black text-zinc-900 tracking-tight leading-tight">
                BRINGING VISION TO LIFE
              </h2>
            </div>
            
            <p className="text-zinc-650 text-sm leading-relaxed font-sans">
              To transform ideas into immersive visual experiences that resonate with depth, authenticity, and cinematic excellence. At Hard Rain Productions, we bridge the gap between creative vision and technical precision, delivering storytelling that doesn't just show—it moves, inspires, and endures.
            </p>

            <div className="pt-6 border-t border-zinc-200">
               <h3 className="text-xl font-display font-bold mb-2">Scott Bernstein, Founder/Producer</h3>
               <p className="text-zinc-650 text-sm leading-relaxed font-sans">
                 Scott Bernstein brings a deep commitment to human-centric filmmaking. With a career rooted in both institutional trust and artistic narrative, Scott leads the studio’s mission to elevate every project through collaborative storytelling and technical precision.
               </p>
            </div>

            </div>

          {/* Interactive display image / team mockup rendering */}
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden group border border-zinc-200">
            <img 
              src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=1200" 
              alt="team showcase" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#f4f4f6]/40 via-transparent to-transparent" />
            
            {/* Absolute quote overlying */}
            <div className="absolute bottom-8 left-8 right-8 bg-white/95 border border-zinc-200 p-6 rounded-2xl shadow-md space-y-3 backdrop-blur-md">
              <p className="text-zinc-700 text-xs italic leading-relaxed font-sans">
                "Our filmmaking approach emphasizes deep emotional connection over raw technical noise, ensuring that every minute committed to film has a soul and a reason to exist."
              </p>
              <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 pt-2 border-t border-zinc-100">
                <span className="text-zinc-950 font-bold">SCOTT BERNSTEIN</span>
                <span>CREATIVE DIRECTOR / ARCHITECT</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      <section id="equipment-section" className="py-24 px-4 max-w-7xl mx-auto space-y-12 bg-zinc-900 rounded-3xl mb-12">
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest block">// TECHNICAL CAPABILITIES</span>
              <h2 className="text-4xl font-display font-black text-white tracking-tight leading-tight">OUR EQUIPMENT</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 min-w-full font-mono text-xs pt-2">
              <div className="p-3 border border-zinc-700 rounded-xl space-y-1 bg-zinc-800 shadow-sm">
                <span className="text-blue-400 font-bold block text-[10px]">CAMERA</span>
                <p className="text-zinc-300 text-[10px] leading-relaxed">ARRI Alexa 35, Mini LF, Venice 2, RED V-Raptor.</p>
              </div>
              <div className="p-3 border border-zinc-700 rounded-xl space-y-1 bg-zinc-800 shadow-sm">
                <span className="text-blue-400 font-bold block text-[10px]">GLASS</span>
                <p className="text-zinc-300 text-[10px] leading-relaxed">Cooke Anamorphic/i, Atlas Orion, Leica Summicron-C.</p>
              </div>
              <div className="p-3 border border-zinc-700 rounded-xl space-y-1 bg-zinc-800 shadow-sm">
                <span className="text-blue-400 font-bold block text-[10px]">WORKFLOW</span>
                <p className="text-zinc-300 text-[10px] leading-relaxed">ACES 1.3 color spaces, unified metadata.</p>
              </div>
              <div className="p-3 border border-zinc-700 rounded-xl space-y-1 bg-zinc-800 shadow-sm">
                <span className="text-blue-400 font-bold block text-[10px]">AERIAL</span>
                <p className="text-zinc-300 text-[10px] leading-relaxed">High-res drone, stabilized systems.</p>
              </div>
              <div className="p-3 border border-zinc-700 rounded-xl space-y-1 bg-zinc-800 shadow-sm">
                <span className="text-blue-400 font-bold block text-[10px]">CGI</span>
                <p className="text-zinc-300 text-[10px] leading-relaxed">3D modeling, simulation, compositing.</p>
              </div>
              <div className="p-3 border border-zinc-700 rounded-xl space-y-1 bg-zinc-800 shadow-sm">
                <span className="text-blue-400 font-bold block text-[10px]">STABILIZATION</span>
                <p className="text-zinc-300 text-[10px] leading-relaxed">Gimbal, crane, dolly movement.</p>
              </div>
            </div>
        </div>
      </section>

      {/* CONTACTS / THE ADVANCED INTAKE BOT / LEAD SCORING */}
      <section id="contact-section" className="py-24 px-4 bg-white border-t border-zinc-200/60">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="space-y-4 text-center">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest block">// CONTACT US</span>
            <h2 className="text-4xl font-display font-black text-zinc-900 tracking-tight">LET'S CONNECT</h2>
            <p className="text-zinc-500 text-sm max-w-lg mx-auto font-sans">
              Have a project in mind or just want to say hello? Send us a message and we'll get back to you soon.
            </p>
          </div>

          <form action="https://formspree.io/f/xeewbnnw" method="POST" className="bg-zinc-50 p-8 rounded-2xl border border-zinc-200 shadow-sm space-y-6">
            <div className="space-y-2">
                <label htmlFor="name" className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Name</label>
                <input type="text" id="name" name="name" className="w-full px-4 py-3 rounded-lg border border-zinc-200 focus:ring-2 focus:ring-blue-500 outline-none transition" required />
            </div>
            <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Email Address</label>
                <input type="email" id="email" name="email" className="w-full px-4 py-3 rounded-lg border border-zinc-200 focus:ring-2 focus:ring-blue-500 outline-none transition" required />
            </div>
            <div className="space-y-2">
                <label htmlFor="number" className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Phone Number</label>
                <input type="tel" id="number" name="number" className="w-full px-4 py-3 rounded-lg border border-zinc-200 focus:ring-2 focus:ring-blue-500 outline-none transition" />
            </div>
            <div className="space-y-2">
                <label htmlFor="message" className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Inquiry Message</label>
                <textarea id="message" name="message" rows={4} className="w-full px-4 py-3 rounded-lg border border-zinc-200 focus:ring-2 focus:ring-blue-500 outline-none transition" required></textarea>
            </div>
            <button type="submit" className="w-full py-4 bg-black text-white font-mono text-sm uppercase tracking-widest rounded-lg hover:bg-zinc-800 transition">Submit</button>
          </form>

          {/* FOOTER */}

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-4 border-t border-zinc-200 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-zinc-500 font-mono">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 relative overflow-hidden rounded-full border border-zinc-300 bg-zinc-950 shadow-sm shrink-0">
            <img 
              src="https://i.vimeocdn.com/portrait/122280093_288x288?subrect=0%2C0%2C499%2C499&r=cover&sig=1e999a8ff4532f26453fda4a25ef6cc1975fd035df4523af5f138d6507ef7d00&v=1&region=us" 
              alt="HARD RAIN Logo" 
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover select-none"
            />
          </div>
          <div>
            <span className="text-zinc-900 font-bold tracking-widest block mb-1">HARD RAIN PORTFOLIO & CLIENT PORTAL</span>
            <span>© 2027 Hard Rain Productions. All rights reserved.</span>
          </div>
        </div>
        <div className="flex gap-4">
          <a href="#about-section" className="hover:text-zinc-900">PHILOSOPHY</a>
          <a href="#portfolio-section" className="hover:text-zinc-900">INDEXED WORKS</a>
          <a href="#client-portal-section" className="hover:text-zinc-900">PORTAL LOGS</a>
        </div>
        <p className="text-[9px] text-zinc-400 mt-4 md:mt-0 max-w-sm text-center md:text-right">
            Privacy Policy: Hard Rain Productions respects your privacy. We only collect contact information provided for inquiries. We do not sell or share data. By contacting us, you agree to these terms.
        </p>
      </footer>

    </div>
  );
}
