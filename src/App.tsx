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
import { PORTFOLIO_DATA, ACTIVE_PROJECTS_DATA, AGENT_MANIFEST_DATA, TESTIMONIALS_DATA } from "./data";
import { ClientLogoCarousel } from "./components/ClientLogoCarousel";
import { PortfolioItem, ActiveProject, ReviewComment, Milestone, Testimonial } from "./types";
import { motion, AnimatePresence } from "motion/react";
import ScottImg from "./assets/images/Scott.jpg";
import ScottVid from "./assets/images/Scott.mov";

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

  // Scott Profile Hover States & Refs
  const [isScottHovered, setIsScottHovered] = useState(false);
  const scottVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (scottVideoRef.current) {
      if (isScottHovered) {
        scottVideoRef.current.play().catch(err => console.log("Video play error:", err));
      } else {
        scottVideoRef.current.pause();
        scottVideoRef.current.currentTime = 0;
      }
    }
  }, [isScottHovered]);

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
                const fetchedTitle = data.title ? data.title.replace(/&amp;/g, "&").toUpperCase() : "";
                const fetchedThumb = data.thumbnail_url || updatedItems[index].thumbnailUrl;
                
                if (fetchedTitle && (updatedItems[index].title !== fetchedTitle || updatedItems[index].thumbnailUrl !== fetchedThumb)) {
                  updatedItems[index] = {
                    ...updatedItems[index],
                    title: fetchedTitle,
                    synopsis: data.description || updatedItems[index].synopsis,
                    thumbnailUrl: fetchedThumb,
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
            <div>
              <span className={`font-display font-bold text-base tracking-widest transition-colors duration-300 ${
                hasScrolled ? "text-zinc-900" : "text-white"
              }`}>HARD RAIN</span>
              <span className={`hidden sm:inline font-mono text-[9px] ml-2 tracking-widest uppercase transition-colors duration-300 ${
                hasScrolled ? "text-zinc-500" : "text-zinc-400"
              }`}>PRODUCTIONS</span>
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
            <button onClick={() => { setActiveTab("testimonials"); document.getElementById("testimonials-section")?.scrollIntoView({ behavior: "smooth" }); }} className={`px-4 py-1.5 rounded-full text-[11px] font-mono tracking-wider transition-all duration-300 ${activeTab === "testimonials" ? (hasScrolled ? "bg-white text-black font-semibold shadow-[0_1px_4px_rgba(0,0,0,0.06)]" : "bg-white text-black font-semibold") : (hasScrolled ? "text-zinc-500 hover:text-black" : "text-zinc-400 hover:text-white")}`}>
              TESTIMONIALS
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
        
        {/* Full-bleed background viewport (Actual Vimeo background video loop for HRP HERO) */}
        <div className="absolute inset-0 z-0 pointer-events-none transition-all duration-700 overflow-hidden">
          <div className="absolute inset-0 w-full h-full scale-[1.12]">
            <iframe
              src="https://player.vimeo.com/video/1202329639?background=1&autoplay=1&loop=1&byline=0&portrait=0&title=0&muted=1&quality=1080p"
              className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 aspect-[16/9] min-w-full min-h-full object-cover pointer-events-none opacity-100"
              allow="autoplay; fullscreen"
              title="HRP HERO"
            />
          </div>
        </div>

        {/* TOP LINE INTRODUCTIONS */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col justify-center items-start mt-12 gap-8">
          

        {/* Studio Hook (Moved) */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col justify-center items-end mt-[400px] sm:mt-[500px] gap-8">
           <div className="p-8 bg-zinc-950/20 backdrop-blur-md rounded-3xl border border-zinc-800/80 space-y-6 max-w-2xl text-left shadow-2xl">
             <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-900/50 border border-zinc-800 text-zinc-400 text-[10px] font-mono rounded-full uppercase tracking-[0.2em]">
                ✧ STORIES THAT CONNECT
             </div>
             
             <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-white leading-tight">
               Stories That Connect
             </h1>

             <div className="space-y-4 text-zinc-300 text-sm leading-relaxed font-sans font-light">
               <p>
                 Hard Rain Productions is a full-service creative consultancy. We combine strategy, creativity and production expertise to create content that connects with audiences and inspires action.
               </p>
               <p>
                 Our mission is to transform ideas into immersive visual experiences that resonate with depth, authenticity and cinematic excellence. Every project begins with three simple questions: What is the idea? Why should your audience care? What action do we want them to take? From there, we build compelling visual stories that are crafted with purpose.
               </p>
               <p>
                 At Hard Rain Productions, we don't just produce videos. We develop stories that move, inspire and endure.
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
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-zinc-200 shadow-sm space-y-4">
                <h3 className="text-xl sm:text-2xl font-display font-bold leading-tight text-zinc-900">
                  Scott Bernstein, <span className="text-zinc-500 font-medium text-lg block sm:inline">President / Creative Director / Emmy-Award-Winning Producer</span>
                </h3>
                <div className="text-zinc-650 font-sans text-sm sm:text-base leading-relaxed space-y-4">
                  <p>
                    After years of working on both sides of the table as a client and an agency partner, Scott Bernstein founded Hard Rain Productions in 2007 with one goal: creating work that matters.
                  </p>
                  <p>
                    Built on the premise that the best ideas come from collaboration, Hard Rain Productions combines thoughtful strategy, compelling storytelling and meticulous execution. Every project maintains a focus on each client’s goals and objectives, ensuring the final product is not only visually striking, but purposeful, authentic and memorable.
                  </p>
                </div>
            </div>
            <div className="flex items-center justify-center md:justify-end w-full max-w-xl">
              <div 
                className="relative aspect-video w-full rounded-3xl overflow-hidden bg-black border border-zinc-200/20 shadow-2xl group cursor-pointer"
                onMouseEnter={() => setIsScottHovered(true)}
                onMouseLeave={() => setIsScottHovered(false)}
              >
                {/* Static Image */}
                <img 
                  src={ScottImg} 
                  alt="Scott Bernstein" 
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isScottHovered ? "opacity-0" : "opacity-100"}`}
                  referrerPolicy="no-referrer"
                />

                {/* Hover Video Loop */}
                <video
                  ref={scottVideoRef}
                  src={ScottVid}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isScottHovered ? "opacity-100" : "opacity-0"}`}
                  loop
                  muted
                  playsInline
                />

                {/* Custom Overlay Grid / Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Sleek Cinematic play/pause/hover state badge */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/75 backdrop-blur-md rounded-full border border-zinc-800 pointer-events-none">
                  {isScottHovered ? (
                    <>
                      <div className="flex items-center gap-0.5">
                        <span className="w-1 h-3 bg-blue-500 rounded-full animate-pulse" />
                        <span className="w-1 h-4 bg-blue-500 rounded-full animate-pulse delay-75" />
                        <span className="w-1 h-2 bg-blue-500 rounded-full animate-pulse delay-150" />
                      </div>
                      <span className="text-[10px] font-mono font-semibold tracking-wider text-white uppercase">PLAYING REEL</span>
                    </>
                  ) : (
                    <>
                      <Play size={10} fill="currentColor" className="text-blue-500" />
                      <span className="text-[10px] font-mono font-semibold tracking-wider text-zinc-300 uppercase">HOVER TO PLAY REEL</span>
                    </>
                  )}
                </div>
              </div>
            </div>
        </div>
      </section>


      {/* CINEMATIC PORTFOLIO / THE "PROOF" */}
      <section id="portfolio-section" className="py-24 px-4 md:px-8 max-w-7xl mx-auto space-y-12 mb-12 bg-transparent">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-zinc-200 pb-8">
          <div className="space-y-3">
            <h2 className="text-5xl md:text-7xl font-sans font-black tracking-tight text-zinc-950 uppercase leading-none">THE PORTFOLIO</h2>
            <p className="text-zinc-500 text-sm md:text-base max-w-xl font-sans">A curated selection of national missions, from cinematic masterpieces to critical infrastructure surveys.</p>
          </div>

          <button 
            onClick={() => {
              setSearchQuery("");
              setPortfolioCategory("All");
            }}
            className="px-6 py-3 border border-zinc-300 hover:border-zinc-500 rounded-full text-xs font-sans font-bold uppercase tracking-wider text-zinc-900 hover:bg-zinc-50 transition duration-300 shrink-0 cursor-pointer"
          >
            VIEW ALL MISSIONS
          </button>
        </div>

        {/* Filter & Search controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: "All", label: "ALL WORK" },
              { id: "The Impact", label: "COMMERCIALS" },
              { id: "The Truth", label: "DOCUMENTARIES" },
              { id: "The Craft", label: "NARRATIVE" }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setPortfolioCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-[10px] font-mono tracking-wider transition-all duration-300 border ${
                  portfolioCategory === cat.id 
                    ? "bg-blue-600 text-white border-blue-600 font-bold shadow-md" 
                    : "bg-white text-zinc-650 border-zinc-200 hover:text-blue-600 hover:border-zinc-300"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search by cameras, director, etc..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-2.5 bg-white border border-zinc-200 rounded-full text-xs font-mono text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition shadow-sm"
            />
          </div>
        </div>

        {/* PORTFOLIO GRID */}
        {filteredPortfolio.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-zinc-300 rounded-[32px] max-w-lg mx-auto space-y-4 bg-white shadow-sm">
            <AlertCircle className="w-8 h-8 text-zinc-400 mx-auto" />
            <h3 className="font-display font-medium text-zinc-800 text-base">No Matching Cinematic Projects</h3>
            <p className="text-zinc-500 text-xs">Try searching for other active vectors like "Sony Venice", "Anamorphic", or "Alexa".</p>
            <button 
              onClick={() => { setSearchQuery(""); setPortfolioCategory("All"); }}
              className="px-4 py-2 bg-zinc-900 text-white text-xs font-mono rounded-full hover:bg-zinc-800 transition"
            >
              Reset Search & Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
            <AnimatePresence>
              {filteredPortfolio.map((item, idx) => {
                // Design sequence matching AltitudeCam's beautiful asymmetric layout:
                const layouts = [
                  "col-span-1 md:col-span-2 md:row-span-2 min-h-[320px] md:min-h-[460px]", // Index 0: Large
                  "col-span-1 md:col-span-1 md:row-span-1 min-h-[220px]",                // Index 1: Small
                  "col-span-1 md:col-span-1 md:row-span-1 min-h-[220px]",                // Index 2: Small
                  "col-span-1 md:col-span-1 md:row-span-2 min-h-[320px] md:min-h-[460px]", // Index 3: Tall
                  "col-span-1 md:col-span-1 md:row-span-1 min-h-[220px]",                // Index 4: Small
                  "col-span-1 md:col-span-1 md:row-span-1 min-h-[220px]",                // Index 5: Small
                  "col-span-1 md:col-span-2 md:row-span-1 min-h-[220px]",                // Index 6: Wide
                  "col-span-1 md:col-span-1 md:row-span-1 min-h-[220px]",                // Index 7: Small
                ];
                const gridClass = layouts[idx % layouts.length];

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4 }}
                    onClick={() => setSelectedPortfolioItem(item)}
                    className={`relative group rounded-[28px] md:rounded-[32px] overflow-hidden bg-zinc-950 cursor-pointer shadow-md border border-zinc-200/10 hover:shadow-xl transition-all duration-500 ${gridClass}`}
                  >
                    {/* Background thumbnail image with custom aspect ratio scaling */}
                    <div className="absolute inset-0 overflow-hidden bg-black">
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-90"
                      />
                      {/* Gradient mask */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    </div>

                    {/* Content overlay */}
                    <div className="absolute inset-x-6 bottom-6 flex justify-between items-end z-10">
                      <div className="pr-12 text-left">
                        <h3 className="text-lg md:text-xl font-sans font-bold tracking-tight text-white uppercase leading-tight drop-shadow-md">
                          {item.title.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
                        </h3>
                      </div>
                      
                      {/* Blue Play Circle Icon */}
                      <div className="shrink-0">
                        <div className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 scale-95 group-hover:scale-105 group-hover:bg-blue-500 flex items-center justify-center text-white transition-all duration-300 shadow-lg">
                          <Play size={14} fill="currentColor" className="ml-1 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Subtle Aspect Ratio tag at top-right */}
                    <span className="absolute top-4 right-4 text-[9px] font-mono tracking-widest px-2 py-0.5 bg-black/60 rounded border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {item.aspectRatio}
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

      </section>

      {/* PORTFOLIO LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedPortfolioItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md" onClick={() => setSelectedPortfolioItem(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-5xl w-full aspect-video rounded-2xl md:rounded-3xl overflow-hidden bg-black shadow-2xl border border-zinc-850"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedPortfolioItem.vimeoVideoId ? (
                <iframe
                  src={`https://player.vimeo.com/video/${selectedPortfolioItem.vimeoVideoId}?autoplay=1&title=0&byline=0&portrait=0`}
                  className="w-full h-full border-0 absolute inset-0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title={selectedPortfolioItem.title}
                />
              ) : (
                <div className="relative w-full h-full">
                  <img
                    src={selectedPortfolioItem.thumbnailUrl}
                    alt={selectedPortfolioItem.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                    <h2 className="text-xl md:text-3xl font-sans font-bold text-white uppercase">{selectedPortfolioItem.title}</h2>
                  </div>
                </div>
              )}

              {/* Sleek floating Close Button */}
              <button
                onClick={() => setSelectedPortfolioItem(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 h-10 w-10 rounded-full bg-black/80 hover:bg-zinc-900 border border-zinc-700/80 flex items-center justify-center text-white text-base transition-all duration-300 shadow-md hover:scale-105 cursor-pointer z-10"
                title="Close"
              >
                ✕
              </button>
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
              <h2 className="text-4xl font-display font-black text-zinc-900 tracking-tight leading-tight">What We Do</h2>
              <p className="text-zinc-500 text-sm leading-relaxed font-sans">
                We deliver structured digital film commissions that ensure high aesthetic impact, stunning technical execution, and robust organic discoverability.
              </p>
            </div>

            <div className="space-y-6">
                <div className="p-6 border border-zinc-200/85 hover:border-zinc-300 bg-zinc-50/50 rounded-2xl space-y-3 transition shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-md">
                    <h3 className="font-display font-medium text-zinc-900 text-base md:text-lg">Creative Development</h3>
                    <p className="text-zinc-650 text-xs leading-relaxed font-sans">Concepting, storyboards, scripting, casting, creative direction & project management to your specifications. Whether it’s branded content, event coverage or documentary films, we’re with you at every turn.</p>
                </div>
                <div className="p-6 border border-zinc-200/85 hover:border-zinc-300 bg-zinc-50/50 rounded-2xl space-y-3 transition shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-md">
                    <h3 className="font-display font-medium text-zinc-900 text-base md:text-lg">Creative Production</h3>
                    <p className="text-zinc-650 text-xs leading-relaxed font-sans">An All-Star creative team purpose-built for your project. Best-in-class Directors, DP’s (standard and aerial drone), Audio Engineers, Lighting Technicians, Photographers, Talent and more (or less) scaled to the creative and budget.</p>
                </div>
                <div className="p-6 border border-zinc-200/85 hover:border-zinc-300 bg-zinc-50/50 rounded-2xl space-y-3 transition shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-md">
                    <h3 className="font-display font-medium text-zinc-900 text-base md:text-lg">Post-Production</h3>
                    <p className="text-zinc-650 text-xs leading-relaxed font-sans">Editing, color, motion graphics and sound design (music and voiceover) delivered in the formats you need.</p>
                </div>
            </div>
            

            
            
            
          </div>
        </div>
      </section>








      {/* TESTIMONIALS SECTION */}
      <section id="testimonials-section" className="py-24 px-4 bg-zinc-50/40 border-t border-b border-zinc-200/80">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="space-y-3 text-center">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest block">// CLIENT TESTIMONIALS</span>
            <h2 className="text-4xl font-display font-black text-zinc-900 tracking-tight leading-tight">WORDS FROM OUR COLLABORATORS</h2>
            <p className="text-zinc-500 text-sm max-w-lg mx-auto font-sans">
              Discover how our dedication to cinematic excellence and technical precision translates to powerful stories for leading brands and narrative creators.
            </p>
          </div>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 [column-fill:_balance] w-full">
            {TESTIMONIALS_DATA.map((t) => (
              <div key={t.id} className="break-inside-avoid mb-8 p-8 border border-zinc-200 bg-white rounded-3xl space-y-6 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-lg transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono text-blue-500 bg-blue-500/10 border border-blue-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {t.category}
                    </span>
                    <span className="text-3xl text-zinc-300 font-serif select-none leading-none">“</span>
                  </div>
                  <p className="text-zinc-700 text-sm leading-relaxed font-sans italic">
                    "{t.quote}"
                  </p>
                </div>
                <div className="pt-4 border-t border-zinc-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 font-mono text-xs font-bold border border-zinc-200 shrink-0">
                    {t.author.split(' ').map(n => n ? n[0] : '').join('')}
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-zinc-900 text-xs tracking-tight">{t.author}</h4>
                    <p className="text-[10px] text-zinc-500 font-mono leading-tight mt-0.5">{t.role}, <span className="font-semibold">{t.company}</span></p>
                  </div>
                </div>
              </div>
            ))}
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
          <a href="#testimonials-section" className="hover:text-zinc-900">TESTIMONIALS</a>
          <a href="#client-portal-section" className="hover:text-zinc-900">PORTAL LOGS</a>
        </div>
        <p className="text-[9px] text-zinc-400 mt-4 md:mt-0 max-w-sm text-center md:text-right">
            Privacy Policy: Hard Rain Productions respects your privacy. We only collect contact information provided for inquiries. We do not sell or share data. By contacting us, you agree to these terms.
        </p>
      </footer>

    </div>
  );
}
