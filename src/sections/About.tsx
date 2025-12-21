import React, { useEffect, useState, useRef } from "react";
import BoundingBox from "../components/BoundingBox";
import Navbar from "../components/Navbar";
import "../components/FaqItem.css";

const STATS = [
  { value: 10, suffix: "+", label: "Years of Legacy", subtext: "Since 2015" },
  { value: 150, suffix: "+", label: "Active Members", subtext: "Core & Board" },
  { value: 50, suffix: "+", label: "Events Hosted", subtext: "Workshops & Hackathons" },
  { value: 100, suffix: "+", label: "Projects Built", subtext: "Open Source" },
];

const MILESTONES = [
  { year: "2015", title: "The Genesis", description: "Founded at VIT with a mission to spread open-source culture and build a community of passionate developers." },
  { year: "2017", title: "First Major Hackathon", description: "Hosted our inaugural hackathon with 200+ participants, putting MFC on the map as a leading tech club." },
  { year: "2019", title: "Annual Tech Fest Launch", description: "Established our flagship annual event featuring workshops, speaker sessions, and competitions." },
  { year: "2022", title: "150+ Member Milestone", description: "Grew into one of VIT's largest technical clubs with members across Technical, Design, and Management." },
  { year: "2025", title: "A Decade of Impact", description: "Celebrating 10 years of innovation, countless success stories, and an ever-growing alumni network." },
];

const DOMAINS = [
  {
    name: "Technical",
    tagline: "Build the Future",
    color: "#4ecdc4",
    icon: "💻",
    skills: ["Web Development", "App Development", "AI/ML", "Cybersecurity", "Competitive Programming"],
    description: "From full-stack development to cutting-edge AI — master the technologies shaping tomorrow.",
  },
  {
    name: "Design",
    tagline: "Create the Vision",
    color: "#f7c531",
    icon: "🎨",
    skills: ["UI/UX Design", "Graphic Design", "3D Modeling", "Video Editing", "Motion Graphics"],
    description: "Transform ideas into stunning visuals. Learn industry-standard tools and design thinking.",
  },
  {
    name: "Management",
    tagline: "Lead the Way",
    color: "#a855f7",
    icon: "📊",
    skills: ["Event Management", "Outreach & PR", "Editorial & Content", "Sponsorship", "Operations"],
    description: "Develop leadership skills, manage large-scale events, and build professional networks.",
  },
];

const WHY_JOIN = [
  { icon: "🚀", title: "Skill Development", description: "Hands-on workshops, mentorship from seniors, and real project experience." },
  { icon: "🌐", title: "Industry Exposure", description: "Network with professionals, attend exclusive talks, and gain insights into tech careers." },
  { icon: "🏆", title: "Competitions & Hackathons", description: "Represent VIT in national competitions and organize campus-wide events." },
  { icon: "👥", title: "Community & Friends", description: "Join a family of 150+ like-minded individuals who support and inspire each other." },
  { icon: "📜", title: "Certifications", description: "Earn recognized certificates for your contributions and skill development." },
  { icon: "💼", title: "Career Boost", description: "Alumni network, internship referrals, and portfolio-worthy projects." },
];

const TESTIMONIALS = [
  { name: "Arjun S.", role: "Tech Lead '23", quote: "MFC transformed my college life. The projects I worked on here got me my dream internship.", avatar: "👨‍💻" },
  { name: "Priya M.", role: "Design Head '22", quote: "From zero design knowledge to leading a team — MFC gave me the platform to grow.", avatar: "👩‍🎨" },
  { name: "Rahul K.", role: "Core Member '24", quote: "The mentorship and community here is unmatched. Best decision I made in college.", avatar: "🧑‍💼" },
];

const About: React.FC = () => {
  const [animatedStats, setAnimatedStats] = useState<number[]>([0, 0, 0, 0]);
  const [activeMilestone, setActiveMilestone] = useState(0);
  const [activeDomain, setActiveDomain] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);
  const [hoveredBenefit, setHoveredBenefit] = useState<number | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    
    const handleScroll = () => {
      const scrollTop = el.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setScrollProgress(progress);
    };
    
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !statsVisible) {
          setStatsVisible(true);
          STATS.forEach((stat, i) => {
            let current = 0;
            const step = stat.value / 40;
            const timer = setInterval(() => {
              current += step;
              if (current >= stat.value) {
                current = stat.value;
                clearInterval(timer);
              }
              setAnimatedStats((prev) => {
                const arr = [...prev];
                arr[i] = Math.floor(current);
                return arr;
              });
            }, 30);
          });
        }
      },
      { threshold: 0.2 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [statsVisible]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMilestone((prev) => (prev + 1) % MILESTONES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-screen h-full flex flex-col md:flex-row justify-center items-center p-4 overflow-hidden">
      <Navbar />
      <BoundingBox className="relative overflow-hidden">
        <div className="scroll-indicator" aria-hidden>
          <div className="scroll-progress" style={{ height: `${scrollProgress}%` }} />
        </div>

        <div ref={containerRef} className="faq-page-container h-full custom-scroll overflow-y-auto">
          <div className="faq-content-wrapper">
            
            <header className="relative mb-20 pt-4">
              <div className="absolute top-0 left-[10%] w-2 h-2 bg-prime opacity-60 animate-pulse" style={{ animationDelay: "0s" }}></div>
              <div className="absolute top-8 right-[15%] w-3 h-3 bg-prime opacity-40 animate-pulse" style={{ animationDelay: "0.5s" }}></div>
              <div className="absolute top-16 left-[5%] w-2 h-2 bg-prime opacity-50 animate-pulse" style={{ animationDelay: "1s" }}></div>
              
              <div className="text-center relative z-10">
                
                <h1 
                  className="faq-title relative inline-block" 
                  style={{ marginBottom: "16px" }}
                >
                  Mozilla Firefox Club
                  {/* Underline accent - asymmetric */}
                  <span 
                    className="absolute -bottom-2 left-[10%] h-1 bg-gradient-to-r from-prime via-prime/70 to-transparent"
                    style={{ width: "60%", borderRadius: "2px" }}
                  ></span>
                </h1>
                
                <p className="faq-subtitle mt-6" style={{ maxWidth: "700px", margin: "24px auto 0" }}>
                  VIT's Premier Technical Community — Empowering students through 
                  open-source, innovation, and collaboration since 2015.
                </p>
              </div>
            </header>

            <section ref={statsRef} className="mb-20">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {STATS.map((stat, i) => (
                  <div
                    key={i}
                    className="relative group"
                    style={{ 
                      transform: `translateY(${i % 2 === 0 ? '0' : '12px'})`,
                    }}
                    onMouseEnter={() => setHoveredStat(i)}
                    onMouseLeave={() => setHoveredStat(null)}
                  >
                    <div 
                      className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 transition-all duration-300"
                      style={{ 
                        borderColor: hoveredStat === i ? "#fc7a00" : "#333",
                        transform: hoveredStat === i ? "scale(1.2)" : "scale(1)"
                      }}
                    ></div>
                    <div 
                      className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 transition-all duration-300"
                      style={{ 
                        borderColor: hoveredStat === i ? "#fc7a00" : "#333",
                        transform: hoveredStat === i ? "scale(1.2)" : "scale(1)"
                      }}
                    ></div>
                    
                    <div
                      className="faq-item text-center py-6 transition-all duration-300"
                      style={{ 
                        cursor: "default",
                        transform: hoveredStat === i ? "scale(1.02)" : "scale(1)",
                        borderColor: hoveredStat === i ? "#fc7a00" : undefined,
                      }}
                    >
                      <div 
                        className="text-3xl md:text-4xl font-bold mb-1 transition-all duration-300"
                        style={{ 
                          color: "#fc7a00",
                          textShadow: hoveredStat === i ? "0 0 20px rgba(252, 122, 0, 0.5)" : "none"
                        }}
                      >
                        {animatedStats[i]}{stat.suffix}
                      </div>
                      <div className="text-white text-xs md:text-sm font-bold mb-1">
                        {stat.label}
                      </div>
                      <div className="text-gray-500 text-[10px]">
                        {stat.subtext}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-20">
              <div className="faq-item relative overflow-hidden" style={{ cursor: "default" }}>
                <div 
                  className="absolute top-0 right-0 w-32 h-32 opacity-10"
                  style={{ 
                    background: "linear-gradient(135deg, #fc7a00 0%, transparent 60%)",
                  }}
                ></div>
                
                <div 
                  className="absolute left-0 top-0 bottom-0 w-1"
                  style={{ background: "linear-gradient(180deg, #fc7a00, #ff8c1a, transparent)" }}
                ></div>
                
                <div className="pl-4">
                  <span className="category-tag">OUR STORY</span>
                  <div className="question-section mt-4" style={{ marginBottom: "0" }}>
                    <div className="avatar" style={{ animation: "float 3s ease-in-out infinite" }}>
                      <img src="/fox-avatar.png" alt="MFC" className="avatar-img" />
                    </div>
                    <div>
                      <h2 className="question-text" style={{ marginBottom: "12px" }}>
                        Who is Mozilla Firefox Club?
                      </h2>
                      <p className="answer-text" style={{ opacity: 1 }}>
                        Mozilla Firefox Club - VIT has been a beacon of innovation within VIT's 
                        student developer community for over a decade. We're not just a club — 
                        we're a <span style={{ color: "#fc7a00", fontWeight: "bold" }}>launchpad for careers</span>, 
                        a platform for learning, and a family that supports each other's growth.
                        <br /><br />
                        With <span style={{ color: "#fc7a00", fontWeight: "bold" }}>150+ dedicated members</span> across 
                        Technical, Design, and Management domains, we've built an influential presence 
                        that extends beyond campus — into hackathons, open-source communities, and 
                        the tech industry.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-20">
              <div className="faq-header relative" style={{ marginBottom: "30px" }}>
                <h2 className="faq-title" style={{ fontSize: "clamp(1.2rem, 3vw, 2rem)" }}>
                  Why Join MFC?
                </h2>
                <p className="faq-subtitle">What's in it for you</p>
                <div className="flex justify-center mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-[2px] bg-gray-700"></div>
                    <div className="w-2 h-2 bg-prime rotate-45"></div>
                    <div className="w-8 h-[2px] bg-gray-700"></div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {WHY_JOIN.map((item, i) => (
                  <div
                    key={i}
                    className="faq-item relative overflow-hidden group"
                    style={{ 
                      cursor: "default", 
                      padding: "20px",
                      transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                      transform: hoveredBenefit === i ? "translateY(-4px) scale(1.01)" : "translateY(0)",
                    }}
                    onMouseEnter={() => setHoveredBenefit(i)}
                    onMouseLeave={() => setHoveredBenefit(null)}
                  >
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ 
                        background: "linear-gradient(45deg, rgba(252,122,0,0.1), transparent, rgba(252,122,0,0.1))",
                        backgroundSize: "200% 200%",
                        animation: hoveredBenefit === i ? "gradient-shift 2s ease infinite" : "none",
                      }}
                    ></div>
                    
                    <div className="flex items-start gap-4 relative z-10">
                      <div 
                        className="text-2xl p-2 rounded-lg transition-all duration-300"
                        style={{ 
                          background: hoveredBenefit === i ? "rgba(252, 122, 0, 0.2)" : "rgba(252, 122, 0, 0.1)",
                          transform: hoveredBenefit === i ? "rotate(-5deg) scale(1.1)" : "rotate(0)",
                        }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <h3 
                          className="text-white font-bold text-sm mb-2 transition-colors duration-300"
                          style={{ 
                            lineHeight: "1.4",
                            color: hoveredBenefit === i ? "#fc7a00" : "#fff"
                          }}
                        >
                          {item.title}
                        </h3>
                        <p className="text-gray-400 text-xs" style={{ lineHeight: "1.6" }}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                    
                    <div 
                      className="absolute bottom-2 right-3 text-4xl font-bold opacity-5 transition-opacity duration-300"
                      style={{ opacity: hoveredBenefit === i ? 0.15 : 0.05 }}
                    >
                      0{i + 1}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-20">
              <div className="faq-header" style={{ marginBottom: "30px" }}>
                <h2 className="faq-title" style={{ fontSize: "clamp(1.2rem, 3vw, 2rem)" }}>
                  Our Domains
                </h2>
                <p className="faq-subtitle">Choose your path to excellence</p>
              </div>

              <div className="flex justify-center gap-2 md:gap-4 mb-8 flex-wrap">
                {DOMAINS.map((domain, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveDomain(i)}
                    className="relative px-5 py-2.5 text-xs md:text-sm font-bold transition-all duration-400 overflow-hidden"
                    style={{
                      background: activeDomain === i ? domain.color : "transparent",
                      color: activeDomain === i ? "#000" : domain.color,
                      border: `2px solid ${domain.color}`,
                      borderRadius: "4px",
                      transform: activeDomain === i ? "scale(1.05)" : "scale(1)",
                      boxShadow: activeDomain === i ? `0 0 20px ${domain.color}40, 0 0 40px ${domain.color}20` : "none",
                    }}
                  >
                    {activeDomain === i && (
                      <div 
                        className="absolute inset-0"
                        style={{
                          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                          animation: "shimmer 2s infinite",
                        }}
                      ></div>
                    )}
                    <span className="relative z-10">{domain.icon} {domain.name}</span>
                  </button>
                ))}
              </div>

              <div 
                className="faq-item relative overflow-hidden"
                style={{ 
                  cursor: "default",
                  borderColor: DOMAINS[activeDomain].color,
                  transition: "all 0.4s ease",
                  boxShadow: `0 0 30px ${DOMAINS[activeDomain].color}15`,
                }}
              >
                <div 
                  className="absolute top-3 right-3 w-6 h-6 border-2"
                  style={{ 
                    borderColor: DOMAINS[activeDomain].color,
                    opacity: 0.3,
                    animation: "spin-slow 10s linear infinite",
                  }}
                ></div>
                
                <div className="flex flex-col md:flex-row gap-6 relative z-10">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span 
                        className="text-4xl"
                        style={{ animation: "bounce-subtle 2s ease-in-out infinite" }}
                      >
                        {DOMAINS[activeDomain].icon}
                      </span>
                      <div>
                        <h3 
                          className="text-xl md:text-2xl font-bold"
                          style={{ color: DOMAINS[activeDomain].color }}
                        >
                          {DOMAINS[activeDomain].name}
                        </h3>
                        <p className="text-gray-400 text-xs italic">
                          {DOMAINS[activeDomain].tagline}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-4" style={{ lineHeight: "1.8" }}>
                      {DOMAINS[activeDomain].description}
                    </p>
                  </div>

                  <div className="md:w-1/3">
                    <h4 
                      className="text-xs font-bold mb-3 uppercase tracking-wider flex items-center gap-2"
                      style={{ color: DOMAINS[activeDomain].color }}
                    >
                      <span className="w-3 h-[2px]" style={{ background: DOMAINS[activeDomain].color }}></span>
                      What You'll Learn
                    </h4>
                    <div className="space-y-2">
                      {DOMAINS[activeDomain].skills.map((skill, j) => (
                        <div 
                          key={j}
                          className="flex items-center gap-2 text-xs text-gray-400 transition-all duration-300"
                          style={{ 
                            opacity: 1,
                            transform: "translateX(0)",
                            animation: `slide-in 0.3s ease-out ${j * 0.1}s both`,
                          }}
                        >
                          <span 
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: DOMAINS[activeDomain].color }}
                          ></span>
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-20">
              <div className="faq-header" style={{ marginBottom: "30px" }}>
                <h2 className="faq-title" style={{ fontSize: "clamp(1.2rem, 3vw, 2rem)" }}>
                  Our Journey
                </h2>
                <p className="faq-subtitle">A decade of milestones</p>
              </div>

              <div 
                className="faq-item relative overflow-hidden"
                style={{ 
                  cursor: "default", 
                  minHeight: "200px",
                  background: "linear-gradient(145deg, rgba(26,26,26,0.9), rgba(13,13,13,0.95))",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div 
                  className="absolute top-2 right-4 text-7xl md:text-9xl font-bold pointer-events-none select-none"
                  style={{ 
                    color: "#fc7a00",
                    opacity: 0.08,
                    animation: "glitch-text 3s infinite",
                  }}
                >
                  {MILESTONES[activeMilestone].year}
                </div>

                <div 
                  className="absolute inset-0 pointer-events-none opacity-30"
                  style={{
                    background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)",
                  }}
                ></div>

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span 
                      className="category-tag"
                      style={{ animation: "pulse-glow 2s ease-in-out infinite" }}
                    >
                      {MILESTONES[activeMilestone].year}
                    </span>
                    <div className="flex-1 h-[1px] bg-gradient-to-r from-prime/50 to-transparent"></div>
                  </div>
                  
                  <h3 
                    className="question-text mb-3"
                    style={{ animation: "fade-up 0.5s ease-out" }}
                    key={`title-${activeMilestone}`}
                  >
                    {MILESTONES[activeMilestone].title}
                  </h3>
                  <p 
                    className="answer-text" 
                    style={{ opacity: 1, animation: "fade-up 0.5s ease-out 0.1s both" }}
                    key={`desc-${activeMilestone}`}
                  >
                    {MILESTONES[activeMilestone].description}
                  </p>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-900">
                  <div 
                    className="h-full"
                    style={{ 
                      background: "linear-gradient(90deg, #fc7a00, #ff8c1a, #ffcc00)",
                      animation: "timeline-progress 5s linear infinite",
                      boxShadow: "0 0 10px #fc7a00, 0 0 20px rgba(252, 122, 0, 0.3)",
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-center items-center gap-0 mt-8">
                {MILESTONES.map((m, i) => (
                  <React.Fragment key={i}>
                    <button
                      onClick={() => setActiveMilestone(i)}
                      className="flex flex-col items-center group relative"
                      aria-label={`View ${m.year} milestone`}
                    >
                      <span 
                        className="text-[10px] mb-2 transition-all duration-300"
                        style={{ 
                          color: activeMilestone === i ? "#fc7a00" : "#555",
                          transform: activeMilestone === i ? "scale(1.1)" : "scale(1)",
                          fontWeight: activeMilestone === i ? "bold" : "normal",
                        }}
                      >
                        {m.year}
                      </span>
                      
                      <div className="relative">
                        {activeMilestone === i && (
                          <div 
                            className="absolute inset-0 rounded-full"
                            style={{
                              background: "#fc7a00",
                              animation: "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
                              transform: "scale(2)",
                              opacity: 0.3,
                            }}
                          ></div>
                        )}
                        <div 
                          className="w-4 h-4 rounded-full transition-all duration-300 relative z-10 border-2"
                          style={{ 
                            background: activeMilestone === i ? "#fc7a00" : "#1a1a1a",
                            borderColor: activeMilestone === i ? "#fc7a00" : "#333",
                            boxShadow: activeMilestone === i ? "0 0 15px rgba(252, 122, 0, 0.6)" : "none"
                          }}
                        />
                      </div>
                    </button>
                    
                    {i < MILESTONES.length - 1 && (
                      <div 
                        className="w-8 md:w-12 h-[2px] mt-6"
                        style={{ 
                          background: i < activeMilestone 
                            ? "linear-gradient(90deg, #fc7a00, #fc7a00)" 
                            : "linear-gradient(90deg, #333, #333)",
                        }}
                      ></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </section>

            <section className="mb-20">
              <div className="faq-header" style={{ marginBottom: "30px" }}>
                <h2 className="faq-title" style={{ fontSize: "clamp(1.2rem, 3vw, 2rem)" }}>
                  What Members Say
                </h2>
                <p className="faq-subtitle">Real stories from our community</p>
              </div>

              <div 
                className="faq-item relative"
                style={{ cursor: "default", overflow: "hidden" }}
              >
                <div 
                  className="absolute top-4 left-4 text-6xl leading-none opacity-10 select-none"
                  style={{ color: "#fc7a00", fontFamily: "Georgia, serif" }}
                >
                  "
                </div>
                <div 
                  className="absolute bottom-4 right-4 text-6xl leading-none opacity-10 select-none rotate-180"
                  style={{ color: "#fc7a00", fontFamily: "Georgia, serif" }}
                >
                  "
                </div>
                
                <div className="text-center py-4 relative z-10">
                  {/* Avatar with glow ring */}
                  <div className="relative inline-block mb-4">
                    <div 
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: "conic-gradient(from 0deg, #fc7a00, #ff8c1a, #fc7a00)",
                        animation: "spin-slow 4s linear infinite",
                        padding: "3px",
                      }}
                    ></div>
                    <div 
                      className="text-5xl relative z-10 bg-gray-900 rounded-full p-2"
                      style={{ animation: "float 3s ease-in-out infinite" }}
                    >
                      {TESTIMONIALS[activeTestimonial].avatar}
                    </div>
                  </div>
                  
                  <p 
                    className="text-gray-300 text-sm md:text-base italic mb-4"
                    style={{ lineHeight: "1.8", maxWidth: "600px", margin: "0 auto 16px" }}
                    key={`quote-${activeTestimonial}`}
                  >
                    "{TESTIMONIALS[activeTestimonial].quote}"
                    <span 
                      className="inline-block w-[2px] h-4 ml-1 bg-prime"
                      style={{ animation: "blink 1s step-end infinite" }}
                    ></span>
                  </p>
                  
                  <div 
                    className="text-white font-bold text-sm"
                    style={{ color: "#fc7a00" }}
                  >
                    {TESTIMONIALS[activeTestimonial].name}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {TESTIMONIALS[activeTestimonial].role}
                  </div>
                </div>

                <div className="flex justify-center items-center gap-4 mt-6">
                  <button
                    onClick={() => setActiveTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                    className="w-8 h-8 rounded border border-gray-700 hover:border-prime transition-colors flex items-center justify-center text-gray-500 hover:text-prime"
                  >
                    ←
                  </button>
                  
                  <div className="flex gap-2">
                    {TESTIMONIALS.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveTestimonial(i)}
                        className="h-1 rounded-full transition-all duration-300"
                        style={{ 
                          width: activeTestimonial === i ? "24px" : "8px",
                          background: activeTestimonial === i ? "#fc7a00" : "#444",
                        }}
                        aria-label={`View testimonial ${i + 1}`}
                      />
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length)}
                    className="w-8 h-8 rounded border border-gray-700 hover:border-prime transition-colors flex items-center justify-center text-gray-500 hover:text-prime"
                  >
                    →
                  </button>
                </div>
              </div>
            </section>
            <section className="mb-20">
              <div 
                className="relative p-[2px] rounded-2xl overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #fc7a00, #ff8c1a, #ffcc00, #ff8c1a, #fc7a00)",
                  backgroundSize: "300% 300%",
                  animation: "gradient-border 4s ease infinite",
                }}
              >
                <div 
                  className="faq-item text-center py-12 rounded-2xl"
                  style={{ 
                    cursor: "default",
                    background: "linear-gradient(145deg, #1a1200, #0d0800)",
                    border: "none",
                  }}
                >
                  {/* Floating particles */}
                  <div className="absolute top-4 left-[20%] w-1 h-1 bg-prime rounded-full opacity-60" style={{ animation: "float-particle 3s ease-in-out infinite" }}></div>
                  <div className="absolute top-8 right-[25%] w-1.5 h-1.5 bg-prime/80 rounded-full opacity-40" style={{ animation: "float-particle 4s ease-in-out infinite 0.5s" }}></div>
                  <div className="absolute bottom-12 left-[30%] w-1 h-1 bg-prime rounded-full opacity-50" style={{ animation: "float-particle 3.5s ease-in-out infinite 1s" }}></div>
                  
                  <h2 
                    className="text-xl md:text-2xl font-bold mb-3 relative z-10"
                    style={{ color: "#fc7a00" }}
                  >
                    Ready to Begin Your Journey?
                  </h2>
                  <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto relative z-10">
                    Join 150+ students who chose to level up their skills, 
                    build amazing projects, and be part of something bigger.
                  </p>
                  <div className="flex justify-center gap-4 flex-wrap relative z-10">
                    <a 
                      href="/signup" 
                      className="nes-btn is-error"
                      style={{ 
                        animation: "pulse-subtle 2s ease-in-out infinite",
                      }}
                    >
                      Apply Now
                    </a>
                    <a href="/faq" className="nes-btn">
                      View FAQs
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <div className="faq-header" style={{ marginBottom: "20px" }}>
                <h2 className="faq-title" style={{ fontSize: "clamp(1rem, 2.5vw, 1.5rem)" }}>
                  Connect With Us
                </h2>
              </div>

              <div className="flex justify-center gap-8 md:gap-12">
                {[
                  { href: "https://www.instagram.com/mfc_vit", icon: "instagram", label: "Instagram", color: "#E1306C" },
                  { href: "mailto:mozillafirefox@vit.ac.in", icon: "gmail", label: "Email", color: "#EA4335" },
                  { href: "https://www.linkedin.com/company/mfcvit", icon: "linkedin", label: "LinkedIn", color: "#0077B5" },
                  { href: "https://github.com/mfc-vit", icon: "github", label: "GitHub", color: "#fff" },
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    target={social.href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="group relative flex flex-col items-center gap-2"
                    aria-label={social.label}
                  >
                    <div 
                      className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
                      style={{ background: social.color, transform: "scale(0.5)" }}
                    ></div>
                    
                    <div 
                      className="relative transition-all duration-300 group-hover:scale-110"
                      style={{ 
                        filter: "grayscale(100%)",
                        transition: "filter 0.3s, transform 0.3s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.filter = "grayscale(0%)")}
                      onMouseLeave={(e) => (e.currentTarget.style.filter = "grayscale(100%)")}
                    >
                      <i className={`nes-icon ${social.icon} is-medium`}></i>
                    </div>
                    
                    <span 
                      className="text-[10px] text-gray-600 group-hover:text-white transition-colors duration-300"
                    >
                      {social.label}
                    </span>
                  </a>
                ))}
              </div>
            </section>
            <footer className="text-center py-8 border-t border-gray-800/50 relative">
              {/* Decorative line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[2px] bg-gradient-to-r from-transparent via-prime/50 to-transparent"></div>
              
              <p className="text-gray-600 text-[10px]">
                © 2015 – 2025 Mozilla Firefox Club, VIT Vellore
              </p>
              <p className="text-gray-700 text-[10px] mt-1">
                Made with 🧡 by MFC Tech Team
              </p>
            </footer>

          </div>
        </div>

        <style>{`
          @keyframes timeline-progress {
            from { width: 0%; }
            to { width: 100%; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
          }
          @keyframes float-particle {
            0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; }
            50% { transform: translateY(-15px) scale(1.2); opacity: 0.3; }
          }
          @keyframes bounce-subtle {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
          }
          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 5px rgba(252, 122, 0, 0.3); }
            50% { box-shadow: 0 0 15px rgba(252, 122, 0, 0.6); }
          }
          @keyframes pulse-subtle {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
          }
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          @keyframes gradient-shift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes gradient-border {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes slide-in {
            from { opacity: 0; transform: translateX(-10px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes fade-up {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
          @keyframes ping {
            75%, 100% { transform: scale(2); opacity: 0; }
          }
          @keyframes glitch-text {
            0%, 100% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(2px, -2px); }
            60% { transform: translate(-1px, 1px); }
            80% { transform: translate(1px, -1px); }
          }
          @keyframes glitch-skew {
            0%, 100% { transform: skew(0deg); }
            20% { transform: skew(-0.5deg); }
            40% { transform: skew(0.5deg); }
            60% { transform: skew(-0.3deg); }
            80% { transform: skew(0.3deg); }
          }
        `}</style>
      </BoundingBox>
    </div>
  );
};

export default About;
