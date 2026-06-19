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
  Cpu, 
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

  // Client Portal States
  const [selectedClientProject, setSelectedClientProject] = useState<ActiveProject>(ACTIVE_PROJECTS_DATA[0]);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [currentTimecode, setCurrentTimecode] = useState("00:00.00");
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const [videoDuration, setVideoDuration] = useState(120); // standard 2 minutes mockup
  const [clientCommentInput, setClientCommentInput] = useState("");
  const [projectComments, setProjectComments] = useState<ReviewComment[]>(ACTIVE_PROJECTS_DATA[0].reviewComments);

  // Listen to scrolls for Sticky Nav
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

  // Sync client portal reviews state when dynamic project swaps
  useEffect(() => {
    setProjectComments(selectedClientProject.reviewComments);
    setCurrentSeconds(0);
    setCurrentTimecode("00:00.00");
  }, [selectedClientProject]);

  // Handle client portal video scrub click
  const handleScrubTimeline = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const clickedPercentage = clickX / width;
    const newSeconds = Math.round(clickedPercentage * videoDuration);
    
    setCurrentSeconds(newSeconds);
    
    // format as MM:SS.ff frame code
    const minutes = Math.floor(newSeconds / 60);
    const seconds = newSeconds % 60;
    const frames = Math.floor(Math.random() * 24);
    const formattedCode = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${frames.toString().padStart(2, "0")}`;
    setCurrentTimecode(formattedCode);
  };

  // Add a frame accurate client review comment
  const handleAddReviewComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientCommentInput.trim()) return;

    // generate random offset frames
    const minutes = Math.floor(currentSeconds / 60);
    const seconds = currentSeconds % 60;
    const frames = Math.floor(Math.random() * 24);
    const formatCode = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${frames.toString().padStart(2, "0")}`;

    const newComment: ReviewComment = {
      id: "usr-" + Date.now(),
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
      timecode: formatCode,
      timeInSeconds: currentSeconds,
      user: "Client (Guest Reviewer)",
      avatarColor: "bg-blue-600",
      text: clientCommentInput.trim(),
      isResolved: false
    };

    setProjectComments([newComment, ...projectComments]);
    setClientCommentInput("");
  };

  // Resolve comment toggle
  const toggleResolveComment = (commentId: string) => {
    setProjectComments(projectComments.map(c => 
      c.id === commentId ? { ...c, isResolved: !c.isResolved } : c
    ));
  };

  // Automated AI Semantic search keyword matcher for Portfolio Smart Tagging
  const filteredPortfolio = portfolioItems.filter((item) => {
    // 1. Matches Category filter
    const matchesCategory = portfolioCategory === "All" || item.category === portfolioCategory;
    
    // 2. Matches client-side typed semantic queries
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
            <button
              onClick={() => {
                setActiveTab("portfolio");
                document.getElementById("portfolio-section")?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`px-4 py-1.5 rounded-full text-[11px] font-mono tracking-wider transition-all duration-300 ${
                activeTab === "portfolio" 
                  ? (hasScrolled ? "bg-white text-black font-semibold shadow-[0_1px_4px_rgba(0,0,0,0.06)]" : "bg-white text-black font-semibold") 
                  : (hasScrolled ? "text-zinc-500 hover:text-black" : "text-zinc-400 hover:text-white")
              }`}
            >
              PORTFOLIO
            </button>
            <button
              onClick={() => {
                setActiveTab("services");
                document.getElementById("services-section")?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`px-4 py-1.5 rounded-full text-[11px] font-mono tracking-wider transition-all duration-300 ${
                activeTab === "services" 
                  ? (hasScrolled ? "bg-white text-black font-semibold shadow-[0_1px_4px_rgba(0,0,0,0.06)]" : "bg-white text-black font-semibold") 
                  : (hasScrolled ? "text-zinc-500 hover:text-black" : "text-zinc-400 hover:text-white")
              }`}
            >
              PROJECT BUILDER
            </button>
            <button
              onClick={() => {
                setActiveTab("client-portal");
                document.getElementById("client-portal-section")?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`px-4 py-1.5 rounded-full text-[11px] font-mono tracking-wider transition-all duration-300 ${
                activeTab === "client-portal" 
                  ? (hasScrolled ? "bg-white text-black font-semibold shadow-[0_1px_4px_rgba(0,0,0,0.06)]" : "bg-white text-black font-semibold") 
                  : (hasScrolled ? "text-zinc-500 hover:text-black" : "text-zinc-400 hover:text-white")
              }`}
            >
              CLIENT PORTAL
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
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-lighten pointer-events-none transition-all duration-700 overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-transparent to-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070709]/70 via-transparent to-[#070709]/70" />
        </div>

        {/* TOP LINE INTRODUCTIONS */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col justify-center items-start mt-12 gap-8">
          

        {/* Studio Hook (Moved) */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col justify-center items-end mt-[500px] gap-8">
           <div className="space-y-4 max-w-4xl text-right">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-900/80 border border-zinc-800 text-zinc-400 text-[10px] font-mono rounded-full uppercase tracking-[0.2em]">
               ✧ CINEMATIC REEL SHOWCASE
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight text-white leading-tight whitespace-nowrap">
              We Bring <span className="italic inline font-light text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-300">Vision to your ideas.</span>
            </h1>
           </div>
           
           <div className="w-full max-w-4xl text-left">
            <p className="text-white text-base md:text-lg leading-relaxed max-w-xl font-sans font-light">
              Stories that move people, from the screen to the soul.<br /> A prestigious, human-centric production studio embodying high-end craftsmanship and deep emotional impact.
            </p>
          </div>
        </div>
        
        </div>
      </header>

      <ClientLogoCarousel />

      {/* CINEMATIC PORTFOLIO / THE "PROOF" */}
      <section id="portfolio-section" className="py-24 px-4 max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zinc-200 pb-8">
          <div className="space-y-3">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest block">// CINEMATIC PORTFOLIO INDEXING</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-zinc-900">SELECTED MASTERS</h2>
            <p className="text-zinc-500 text-sm max-w-md font-sans">Curated commercial films and narrative treatments. Use AI Smart-Tag parameters to drill down instantly.</p>
          </div>

          {/* AI Search & Filters */}
          <div className="w-full md:w-auto space-y-4">
            
            {/* Semantic Query input */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="AI Semantic Search (e.g. 'Arri Alexa Cooke')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-full text-xs font-mono text-zinc-850 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600/15 focus:border-blue-650 transition shadow-sm"
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
                      : "bg-white text-zinc-650 border-zinc-200 hover:text-blue-600 hover:border-blue-200"
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
                          <span className="text-[9px] font-mono text-blue-400 bg-blue-500/15 border border-blue-500/20 px-1.5 py-0.5 rounded">AI Narrative Generation Standard</span>
                        </div>
                        <p className="text-zinc-200 text-sm leading-relaxed font-sans">{selectedPortfolioItem.projectStory}</p>
                        <div className="text-[10px] text-zinc-500 italic font-mono border-l-2 border-zinc-800 pl-3">
                          <span className="text-blue-400">AI Prompt Instruction:</span> "Write a highly evocative, premium brand narrative that highlights visual emotional weight, light contrasts, and the human 'why' instead of rigid product features."
                        </div>
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

                    {/* AI Dynamically Auto-Tagged / Thematic Analysis */}
                    {selectedPortfolioItem.moodTags && (
                      <div className="space-y-3 bg-zinc-950 border border-zinc-900 p-4 rounded-2xl">
                        <div className="flex items-center gap-1.5 justify-between">
                          <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold">✧ DYNAMIC AI MOOD TAGS</span>
                          <span className="text-[8px] font-mono text-zinc-500">Auto-Tagged by Theme</span>
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
                          Our post-production pipeline dynamically scans the master visual files to tag emotional and lighting vectors directly inside the manifest metadata.
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
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest block">// PREMIUM SERVICE BLUEPRINTS</span>
              <h2 className="text-4xl font-display font-black text-zinc-900 tracking-tight leading-tight">BENEFITS FOCUSED SERVICES</h2>
              <p className="text-zinc-500 text-sm leading-relaxed font-sans">
                We deliver structured digital film commissions that ensure high aesthetic impact, stunning technical execution, and robust organic discoverability.
              </p>
            </div>

            <div className="space-y-6">
              {AGENT_MANIFEST_DATA.services.map((svc) => (
                <div key={svc.name} className="p-6 border border-zinc-200/85 hover:border-zinc-300 bg-zinc-50/50 rounded-2xl space-y-3 transition shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-md">
                  <div className="flex justify-between items-start">
                    <h3 className="font-display font-medium text-zinc-900 text-base md:text-lg">{svc.name}</h3>
                    <span className="text-[10px] font-mono text-blue-750 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">{svc.pricingEstimate}</span>
                  </div>
                  <p className="text-zinc-650 text-xs leading-relaxed font-sans">{svc.description}</p>
                  <div className="pt-2 border-t border-zinc-100 flex justify-between text-[10px] font-mono text-zinc-400">
                    <span>🎬 {svc.equipmentStandard}</span>
                    <span>⏱️ {svc.deliveryTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive AI Scope Builder */}
          <div className="lg:col-span-7 bg-zinc-50 border border-zinc-200 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden">
            
            {/* Background absolute graphic wireframes */}
            <div className="absolute right-[-100px] top-[-100px] w-64 h-64 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

            <div className="space-y-6">
              
              {/* Header */}
              <div className="flex justify-between items-center pb-4 border-b border-zinc-200">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-blue-600 animate-pulse" />
                  <span className="font-display font-semibold text-zinc-900 text-sm tracking-wider uppercase">Interactive Scope Builder AI</span>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 border border-zinc-200 bg-white rounded-full text-zinc-500 font-mono">MODEL: GEMINI 3.5</span>
              </div>

              <p className="text-zinc-500 text-xs">
                Select a baseline template prompt or draft your custom requirements to generate custom filmmaking treatments, budgets, schedules, or gear allocation guidelines instantly.
              </p>

              {/* Quick Prompt Chips */}
              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] font-mono text-zinc-400">Blueprint features auto-enabled</span>
              </div>

              {/* Chat Input Removed */}

            </div>

          </div>

        </div>
      </section>

      {/* CLIENT COOPERATION PORTAL / THE FRAME ACCURATE SCREEN */}
      <section id="client-portal-section" className="py-24 px-4 max-w-7xl mx-auto space-y-12">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zinc-200 pb-8">
          <div className="space-y-3">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest block">// INTEGRATED CLIENT COOPERATION WORKSPACE</span>
            <h2 className="text-4xl font-display font-bold tracking-tight text-zinc-900">ACTIVE PROJECT TRACKING</h2>
            <p className="text-zinc-500 text-sm max-w-md font-sans">Filter reviews, log frame-specific feedback, and inspect live project milestones with full transparency.</p>
          </div>

          {/* Active project swap selectors */}
          <div className="flex gap-2 bg-zinc-100 p-1 rounded-full">
            {ACTIVE_PROJECTS_DATA.map((proj) => (
              <button
                key={proj.id}
                onClick={() => setSelectedClientProject(proj)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono text-left transition flex items-center gap-2 ${
                  selectedClientProject.id === proj.id 
                    ? "bg-white text-zinc-900 shadow-sm font-semibold" 
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                <div className={`h-2 w-2 rounded-full ${selectedClientProject.id === proj.id ? "bg-blue-650 animate-pulse" : "bg-zinc-300"}`} />
                {proj.name.split(" - ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* WORKSPACE MASTER BOARD GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Area: Frame Accurate reviewer */}
          <div className="lg:col-span-8 bg-white border border-zinc-200/80 rounded-3xl p-6 space-y-6 shadow-sm">
            
            {/* Player Simulation screen */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-mono text-zinc-500">
                <span className="flex items-center gap-1.5 uppercase font-medium">
                  <Tv className="w-3.5 h-3.5 text-blue-600" /> WIDESCREEN CINEMATIC REVIEW
                </span>
                <span className="text-[10px] px-2.5 py-0.5 bg-blue-50 border border-blue-100 rounded-full text-blue-600 font-semibold">
                  {selectedClientProject.status} TIER
                </span>
              </div>

              {/* Simulated HTML video view */}
              <div className="relative aspect-[2.39/1] bg-black rounded-2xl overflow-hidden group border border-zinc-950">
                
                {/* Simulated frame preview image / actual mock dynamic video tag */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={selectedClientProject.thumbnailUrl} 
                    alt="active review" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-75"
                  />
                  
                  {/* Absolute subtle visual scanlines */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20" />
                </div>

                {/* Overlaid simulated HUD info tags */}
                <div className="absolute top-4 left-4 font-mono text-[10px] bg-black/85 border border-white/10 px-2.5 py-1 text-zinc-300 rounded-md space-y-0.5">
                  <div>CAM: {selectedClientProject.director}</div>
                  <div>PROJID: {selectedClientProject.id.toUpperCase()}</div>
                </div>

                <div className="absolute top-4 right-4 font-mono text-[10px] bg-black/85 border border-white/10 px-2.5 py-1 text-zinc-300 rounded-md">
                  FPS: <span className="text-blue-400">23.976</span>
                </div>

                {/* Absolute overlay for play fader */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition">
                  <button 
                    onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                    className="h-14 w-14 rounded-full bg-white hover:bg-zinc-100 text-black flex items-center justify-center text-lg shadow-xl cursor-pointer transition-transform duration-300 hover:scale-105"
                  >
                    {isPlayingVideo ? <Pause className="w-5 h-5 text-black fill-black" /> : <Play className="w-5 h-5 text-black fill-black ml-1" />}
                  </button>
                </div>

                {/* Bottom Scrub panel */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                  
                  <div className="flex justify-between items-center text-[10px] font-mono text-zinc-300 pb-2">
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></span>
                      TIMECODE: <span className="text-white font-bold">{currentTimecode}</span>
                    </span>
                    <span>TARGET WORKFLOW: ACES RAW SPEC</span>
                  </div>

                  {/* Timeline Scrub track */}
                  <div 
                    onClick={handleScrubTimeline}
                    className="h-2 bg-zinc-800 rounded-full overflow-hidden relative cursor-col-resize hover:h-2.5 transition-all"
                  >
                    <div 
                      className="absolute inset-y-0 left-0 bg-blue-600" 
                      style={{ width: `${(currentSeconds / videoDuration) * 100}%` }}
                    />
                    
                    {/* Simulated comment tags along timeline */}
                    {projectComments.map((comment) => {
                      const percentage = (comment.timeInSeconds / videoDuration) * 100;
                      return (
                        <div
                          key={comment.id}
                          className="absolute h-3 w-1.5 bg-blue-400 border border-black top-[-2px] rounded-full hover:scale-125 transition"
                          style={{ left: `${percentage}%` }}
                          title={comment.text}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentSeconds(comment.timeInSeconds);
                            setCurrentTimecode(comment.timecode);
                          }}
                        />
                      );
                    })}
                  </div>

                </div>

              </div>
            </div>

            {/* Core Comment Log box */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-display font-bold text-zinc-950 text-sm uppercase">Add Review Marker at {currentTimecode}</h4>
                <p className="text-zinc-400 text-[10px] font-mono">&gt; Click timeline scrub bar to select frame target</p>
              </div>

              <form onSubmit={handleAddReviewComment} className="flex gap-3">
                <input
                  type="text"
                  placeholder="e.g. 'Color grading feels a tiny bit offset here. Let's saturate the highlights.' "
                  value={clientCommentInput}
                  onChange={(e) => setClientCommentInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 transition text-white text-xs font-mono font-medium rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md border border-blue-600"
                >
                  <Send className="w-3.5 h-3.5" /> MARK FRAME
                </button>
              </form>
            </div>

            {/* Comment details list */}
            <div className="space-y-4 pt-4 border-t border-zinc-100">
              <h4 className="font-display font-semibold text-zinc-900 text-xs uppercase tracking-wider">Active Marker Feed</h4>
              
              <div className="space-y-3.5 max-h-64 overflow-y-auto">
                {projectComments.map((comment) => (
                  <div 
                    key={comment.id} 
                    className={`p-4 border rounded-2xl flex flex-col md:flex-row justify-between gap-3 items-start transition ${
                      comment.isResolved 
                        ? "bg-zinc-55/30 border-zinc-200 opacity-40 shadow-none" 
                        : "bg-zinc-50/50 border-zinc-200/80 hover:border-zinc-300 shadow-[0_2px_10px_rgba(0,0,0,0.01)]"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono bg-blue-50 text-blue-750 px-2 py-0.5 rounded-full border border-blue-100">
                          {comment.timecode}
                        </span>
                        <span className="text-xs font-bold text-zinc-800">{comment.user}</span>
                        <span className="text-[9px] font-mono text-zinc-400">{comment.timestamp}</span>
                      </div>
                      <p className="text-zinc-650 text-xs font-mono leading-relaxed">{comment.text}</p>
                    </div>

                    <button
                      onClick={() => toggleResolveComment(comment.id)}
                      className={`px-3 py-1 rounded-full text-[9px] font-mono transition cursor-pointer shrink-0 ${
                        comment.isResolved 
                          ? "bg-zinc-100 text-zinc-400 border border-zinc-200" 
                          : "bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100"
                      }`}
                    >
                      {comment.isResolved ? "RESOLVED" : "RESOLVE"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Area: Timelines & Budget indexes */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Dynamic Status Index banner */}
            <div className="p-6 bg-white border border-zinc-200/80 rounded-3xl space-y-4 shadow-sm text-zinc-900">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block font-bold">PRODUCTION HEALTH INDEX</span>
              
              <div className="space-y-3 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-zinc-700 mb-1">
                    <span>Task Completion</span>
                    <span className="text-zinc-950 font-bold">{selectedClientProject.completionPercentage}%</span>
                  </div>
                  <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600" style={{ width: `${selectedClientProject.completionPercentage}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-zinc-700 mb-1">
                    <span>Budget Consumed</span>
                    <span className="text-zinc-950 font-bold">{selectedClientProject.budgetSpentPercentage}% ({selectedClientProject.budgetTotal})</span>
                  </div>
                  <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600" style={{ width: `${selectedClientProject.budgetSpentPercentage}%` }} />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-100 text-[11px] font-mono text-zinc-500 flex justify-between">
                <span>NEXT SHOT BLOCK:</span>
                <span className="text-zinc-900 font-bold">{selectedClientProject.nextShootDate || "On schedule"}</span>
              </div>
            </div>

            {/* Phased Project Milestone Timeline tracker */}
            <div className="p-6 bg-white border border-zinc-200/80 rounded-3xl space-y-4 shadow-sm text-zinc-900">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block font-bold">PROJECT MILESTONES</span>

              <div className="space-y-4 timeline-feed">
                {selectedClientProject.timeline.map((step) => (
                  <div key={step.id} className="relative flex gap-3 text-xs">
                    {/* Line connection */}
                    <div className="flex flex-col items-center">
                      <div className={`h-5 w-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                        step.status === "completed" 
                          ? "bg-black text-white" 
                          : step.status === "current" 
                            ? "bg-blue-600 text-white font-semibold shadow-sm animate-pulse" 
                            : "bg-zinc-100 text-zinc-400"
                      }`}>
                        {step.status === "completed" ? "✓" : "!"}
                      </div>
                      <div className="w-0.5 bg-zinc-100 flex-1 min-h-[30px]" />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-zinc-400 uppercase">{step.dueDate}</span>
                      <h4 className={`font-display font-medium text-sm leading-tight ${step.status === "current" ? "text-blue-600" : "text-zinc-900"}`}>
                        {step.title}
                      </h4>
                      <p className="text-zinc-500 text-[11px] leading-snug">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* ABOUT / THE LEAD TEAM & MISSION */}
      <section id="about-section" className="py-24 px-4 bg-zinc-50/40 border-t border-zinc-200/80">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest block">// SITE MISSION STATEMENT & ABOUT US</span>
              <h2 className="text-4xl font-display font-black text-zinc-900 tracking-tight leading-tight">
                STORIES THAT MATTERED. VISIONS THAT REMAIN.
              </h2>
            </div>
            
            <p className="text-zinc-650 text-sm leading-relaxed font-sans">
              We operate at the core of human legacy. In an era dominated by superficial scroll culture and cold digital specs, we have shifted our gaze. We are transitioning our philosophy from simple mechanical future-shaping to something older and deeper: telling stories that matter. Stories of raw survival, ecological connection, cosmic longing, and domestic solace.
            </p>

            <p className="text-zinc-650 text-sm leading-relaxed font-sans">
              By merging authentic cinematic craftsmanship—from premium Cooke glass to intimate natural lighting—with modern search-readable metadata, we ensure our projects touch human hearts while being recognized by machine intelligence. Each project is crafted with deep artistic intent, ensuring your vision moves people from the screen to the soul.
            </p>

            <div className="grid grid-cols-2 gap-6 min-w-full font-mono text-xs text-zinc-600 pt-2">
              <div className="p-4 border border-zinc-200 rounded-xl space-y-2 bg-white shadow-sm">
                <span className="text-blue-700 font-bold block">01 / ANALOG HEART</span>
                <p className="text-zinc-500 text-[11px] leading-relaxed">Cooke primes, natural lighting, soulful pacing, raw human connection.</p>
              </div>
              <div className="p-4 border border-zinc-200 rounded-xl space-y-2 bg-white shadow-sm">
                <span className="text-slate-800 font-bold block">02 / MACHINE COMPATIBLE</span>
                <p className="text-zinc-500 text-[11px] leading-relaxed">Rich semantic schema, searchable metadata logs.</p>
              </div>
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
          <a href="/api/ai-agent-manifest" target="_blank" className="hover:text-blue-500 text-blue-600 font-bold flex items-center gap-1">
            <Cpu className="w-3 h-3" />
          </a>
        </div>
      </footer>

    </div>
  );
}
