import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Play,
  MessageCircle,
  Sparkles,
  Eye,
  Lock,
  Plus,
  Trash2,
  Upload,
  X,
  Check,
  Copy,
  ExternalLink,
  Sliders,
  LogOut,
  Zap,
  TrendingUp,
  Award,
  Flame,
  Sun,
  Moon,
  MoveHorizontal,
  Star
} from "lucide-react";
import { designerInfo, initialThumbnails } from "./data/thumbnailsData";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

const CATEGORIES = ["All", "Gaming", "Documentary", "Business", "Sports", "Entertainment"];

export default function App() {
  const [thumbnails, setThumbnails] = useState(initialThumbnails);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [previewItem, setPreviewItem] = useState(null);
  const [ytDarkMode, setYtDarkMode] = useState(true);
  const [sliderPos, setSliderPos] = useState(50);
  const [copiedPhone, setCopiedPhone] = useState(false);
    const [openFaq, setOpenFaq] = useState(0);


  // Admin States
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [uploading, setUploading] = useState(false);

  // Form States
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Gaming");
  const [newStats, setNewStats] = useState("850K Views • 12.8% CTR");
  const [newFile, setNewFile] = useState(null);

  useEffect(() => {
    fetchThumbnails();
  }, []);

  async function fetchThumbnails() {
    if (!supabase) return;
    const { data, error } = await supabase
      .from("thumbnails")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data && data.length > 0) {
      setThumbnails([...data, ...initialThumbnails]);
    }
  }

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(designerInfo.whatsappNumber);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    const adminPass = import.meta.env.VITE_ADMIN_PASSWORD || "anas123";
    if (passwordInput === adminPass) {
      setIsAuthenticated(true);
      setPasswordInput("");
    } else {
      alert("كلمة المرور غير صحيحة!");
    }
  };

  const handleAddThumbnail = async (e) => {
    e.preventDefault();
    if (!newTitle) return alert("يرجى كتابة عنوان الصورة المصغرة");
    setUploading(true);

    try {
      let finalUrl = "";
      if (newFile && supabase) {
        const fileExt = newFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("thumbnails")
          .upload(fileName, newFile);
        if (uploadError) throw uploadError;

        const { data: publicData } = supabase.storage
          .from("thumbnails")
          .getPublicUrl(fileName);
        finalUrl = publicData.publicUrl;
      } else if (newFile) {
        finalUrl = URL.createObjectURL(newFile);
      }

      if (!finalUrl) {
        alert("يرجى اختيار ملف صورة أولاً");
        setUploading(false);
        return;
      }

      const newEntry = {
        id: Date.now().toString(),
        title: newTitle,
        category: newCategory,
        views_ctr: newStats,
        image_url: finalUrl,
        featured: true
      };

      if (supabase) {
        const { data, error } = await supabase
          .from("thumbnails")
          .insert([{ title: newTitle, category: newCategory, views_ctr: newStats, image_url: finalUrl, featured: true }])
          .select();
        if (error) throw error;
        if (data && data) newEntry.id = data.id;
      }

      setThumbnails([newEntry, ...thumbnails]);
      setNewTitle("");
      setNewFile(null);
      alert("تمت إضافة الصورة بنجاح!");
    } catch (err) {
      alert("خطأ: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteThumbnail = async (id) => {
    if (!window.confirm("حذف هذه الصورة؟")) return;
    if (supabase && id.length > 10) {
      await supabase.from("thumbnails").delete().eq("id", id);
    }
    setThumbnails(thumbnails.filter((item) => item.id !== id));
  };

  const filteredThumbnails =
    selectedCategory === "All"
      ? thumbnails
      : thumbnails.filter((t) => t.category === selectedCategory);

    const getWhatsappLink = (customMsg) => {
    const params = new URLSearchParams();
    params.append("phone", "201507616211");
    params.append("text", customMsg);
    return "https://whatsapp.com?" + params.toString();
  };



  return (
    <div className="min-h-screen bg-[#050507] text-[#FAFAFA] font-sans selection:bg-[#FF0033] selection:text-white overflow-x-hidden">
      {/* Custom Marquee & Grid Styles */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 28s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        .cyber-grid {
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 48px 48px;
        }
      `}</style>

      {/* Ambient Studio Lighting & Cyber Grid */}
      <div className="fixed inset-0 cyber-grid pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-r from-[#FF0033]/25 via-rose-600/20 to-[#F59E0B]/20 blur-[160px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#FF0033]/10 blur-[180px] rounded-full" />
      </div>

      {/* Floating Glass Navbar */}
      <header className="sticky top-4 z-40 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto h-16 px-5 rounded-2xl backdrop-blur-2xl bg-[#0D0D12]/80 border border-white/10 shadow-2xl shadow-black/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF0033] via-rose-600 to-amber-500 p-[1px] shadow-lg shadow-[#FF0033]/30">
              <div className="w-full h-full bg-[#09090B] rounded-[11px] flex items-center justify-center">
                <Play className="w-4 h-4 fill-[#FF0033] text-[#FF0033] ml-0.5" />
              </div>
            </div>
            <div>
              <span className="font-black text-base sm:text-lg tracking-wider block leading-none">
                ANAS <span className="text-[#FF0033]">SAYED</span>
              </span>
              <span className="text-[10px] text-zinc-400 tracking-widest uppercase">
                CTR Studio
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-zinc-400">
            <a href="#portfolio" className="hover:text-white transition">Showcase</a>
            <a href="#why-me" className="hover:text-white transition">CTR Secrets</a>
            <a href="#packages" className="hover:text-white transition">Packages</a>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsAdminOpen(true)}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition"
              title="Admin Dashboard"
            >
              <Lock className="w-4 h-4" />
            </button>
            <a
              href={getWhatsappLink("Hi Anas, I saw your portfolio and want to order a viral thumbnail!")}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-gradient-to-r from-[#FF0033] to-rose-600 hover:from-rose-600 hover:to-[#FF0033] text-white text-xs sm:text-sm font-black px-5 py-2.5 rounded-xl shadow-lg shadow-[#FF0033]/30 transition transform hover:scale-105"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Book Now</span>
            </a>
          </div>
        </div>
      </header>
      {/* Agency-Grade Hero Section */}
      <section className="relative pt-16 pb-12 px-4 sm:px-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#FF0033]/15 to-[#F59E0B]/15 border border-[#FF0033]/30 text-xs font-bold text-rose-200 mb-7 shadow-lg">
          <Flame className="w-4 h-4 text-[#FF0033] animate-bounce" />
          <span>Trusted by Top Creators • +20,000,000 Views Generated</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-5xl mx-auto leading-[1.1]">
          I Design Thumbnails That{" "}
          <span className="bg-gradient-to-r from-[#FF0033] via-rose-400 to-[#F59E0B] bg-clip-text text-transparent">
            Force Viewers to Click
          </span>
        </h1>

        <p className="mt-6 text-zinc-400 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed">
          Stop losing views to boring covers. I’m <strong className="text-white">Anas Sayed</strong> — crafting high-contrast, curiosity-driven YouTube thumbnails engineered for maximum CTR.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <a
            href={getWhatsappLink("Hi Anas! I want to boost my channel CTR with custom thumbnails.")}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 bg-gradient-to-r from-[#FF0033] to-rose-600 text-white font-black px-8 py-4 rounded-2xl shadow-2xl shadow-[#FF0033]/40 transition transform hover:-translate-y-1 text-sm sm:text-base"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Start Your Order on WhatsApp</span>
          </a>
          <a
            href="#portfolio"
            className="px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 font-bold text-sm sm:text-base backdrop-blur-md transition"
          >
            View 20+ Viral Works
          </a>
        </div>

        {/* Glass Stats Bar */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {designerInfo.stats.map((stat, idx) => (
            <div
              key={idx}
              className="relative group p-6 rounded-3xl bg-gradient-to-b from-white/[0.07] to-transparent border border-white/10 backdrop-blur-xl overflow-hidden"
            >
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF0033] to-transparent opacity-70" />
              <div className="text-4xl font-black bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-[#F59E0B] mt-2">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Infinite Scrolling Marquee Strip */}
      <div className="relative py-4 my-6 bg-gradient-to-r from-[#FF0033]/10 via-[#F59E0B]/10 to-[#FF0033]/10 border-y border-white/10 overflow-hidden">
        <div className="animate-marquee flex items-center gap-10 text-xs sm:text-sm font-black uppercase tracking-widest text-zinc-300">
          {[...Array(2)].map((_, loopIdx) => (
            <React.Fragment key={loopIdx}>
              <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-[#F59E0B]" /> EL-DAHEEH DOCUMENTARY STYLE</span>
              <span className="text-[#FF0033]">•</span>
              <span className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-[#FF0033]" /> HIGH-CTR PSYCHOLOGY</span>
              <span className="text-[#F59E0B]">•</span>
              <span className="flex items-center gap-2"><Award className="w-4 h-4 text-[#F59E0B]" /> GAMING & HORROR MANIPULATION</span>
              <span className="text-[#FF0033]">•</span>
              <span>24-HOUR EXPRESS TURNAROUND</span>
              <span className="text-[#F59E0B]">•</span>
              <span>3D LIGHTING & COLOR GRADING</span>
              <span className="text-[#FF0033]">•</span>
            </React.Fragment>
          ))}
        </div>
      </div>
      {/* Portfolio Showcase Grid */}
      <section id="portfolio" className="py-14 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#FF0033]">
              Selected Works (2025–2026)
            </span>
            <h2 className="text-3xl sm:text-4xl font-black mt-1 flex items-center gap-3">
              Viral Thumbnail Gallery
              <Sparkles className="w-7 h-7 text-[#F59E0B]" />
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-[#0D0D12] border border-white/10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-[#FF0033] to-rose-600 text-white shadow-lg shadow-[#FF0033]/30"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Premium 16:9 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredThumbnails.map((item) => (
            <div
              key={item.id}
              onClick={() => setPreviewItem(item)}
              className="group relative cursor-pointer rounded-3xl p-[1px] bg-gradient-to-b from-white/15 to-white/5 hover:from-[#FF0033] hover:to-[#F59E0B] transition-all duration-300 hover:-translate-y-1.5 shadow-2xl"
            >
              <div className="h-full rounded-[23px] overflow-hidden bg-[#0B0B0F]">
                <div className="relative aspect-video overflow-hidden bg-zinc-950">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="flex items-center gap-2 bg-[#FF0033] text-white text-xs font-black px-5 py-2.5 rounded-full shadow-xl transform scale-90 group-hover:scale-100 transition">
                      <Eye className="w-4 h-4" />
                      Preview on YouTube
                    </span>
                  </div>
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-[11px] font-black text-white border border-white/15">
                    {item.category}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-base text-white line-clamp-1 group-hover:text-[#FF0033] transition">
                    {item.title}
                  </h3>
                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#F59E0B]">
                      {item.views_ctr || "High CTR Design"}
                    </span>
                    <span className="text-[11px] text-zinc-500 group-hover:text-zinc-300 transition">
                      Click to inspect →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* CTR Secrets / Value Grid */}
      <section id="why-me" className="py-14 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-[#F59E0B]">
            The Formula Behind Viral Clicks
          </span>
          <h2 className="text-3xl sm:text-4xl font-black mt-1">
            Why Top Channels Choose Anas Sayed
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <Zap className="w-6 h-6 text-[#FF0033]" />,
              title: "0.3-Second Hook Psychology",
              desc: "Viewers scroll fast. Every thumbnail is engineered with strong focal contrast and emotional expressions that stop the thumb instantly."
            },
            {
              icon: <TrendingUp className="w-6 h-6 text-[#F59E0B]" />,
              title: "Curiosity Gap Storytelling",
              desc: "I never repeat the video title on the thumbnail—instead, I create a visual mystery that forces viewers to click to find the answer."
            },
            {
              icon: <Award className="w-6 h-6 text-[#FF0033]" />,
              title: "Mobile-First Readability",
              desc: "Over 75% of YouTube views happen on phones. Every element, face, and text is tested at small mobile sizes for crystal clarity."
            }
          ].map((feat, idx) => (
            <div
              key={idx}
              className="p-7 rounded-3xl bg-gradient-to-b from-white/[0.06] to-transparent border border-white/10 backdrop-blur-xl hover:border-[#FF0033]/40 transition"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                {feat.icon}
              </div>
              <h3 className="text-xl font-black text-white">{feat.title}</h3>
              <p className="text-zinc-400 text-sm mt-2.5 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Packages Section */}
      {/* Interactive Before & After CTR Transformation Slider */}
      <section className="py-16 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-black uppercase tracking-widest text-[#FF0033]">
            The Magic Behind High CTR
          </span>
          <h2 className="text-3xl sm:text-4xl font-black mt-1">
            Drag to See the Transformation
          </h2>
          <p className="text-zinc-400 text-sm mt-2">
            Slide left & right: Raw Unedited Photo vs. Anas Sayed's Viral Thumbnail
          </p>
        </div>

        <div className="relative aspect-video rounded-3xl overflow-hidden border-2 border-white/15 shadow-2xl select-none bg-zinc-950">
          {/* AFTER Image (Right Side - Full Final Thumbnail) */}
          <img
            src="/thumbnails/eldaheeh.jpg"
            alt="After Anas Edit"
            className="w-full h-full object-cover"
          />
          <span className="absolute top-4 right-4 z-10 px-3.5 py-1.5 rounded-full bg-[#FF0033] text-white text-xs font-black shadow-lg">
            AFTER • 13.2% CTR
          </span>

          {/* BEFORE Image (Left Side - Clipped cleanly with clipPath so it never squishes) */}
          <div
            style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            className="absolute inset-0"
          >
            <img
              src="/thumbnails/eldaheeh_before.jpg"
              onError={(e) => {
                e.currentTarget.src = "/thumbnails/eldaheeh.jpg";
                e.currentTarget.style.filter = "grayscale(100%) contrast(70%) brightness(75%)";
              }}
              alt="Before Raw Photo"
              className="w-full h-full object-cover"
            />
            <span className="absolute top-4 left-4 z-10 px-3.5 py-1.5 rounded-full bg-black/85 backdrop-blur-md text-zinc-200 text-xs font-bold border border-white/15">
              BEFORE • RAW PHOTO
            </span>
          </div>

          {/* Vertical Divider Line & Handle */}
          <div
            style={{ left: `${sliderPos}%` }}
            className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] pointer-events-none z-20"
          >
            <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white text-black shadow-2xl flex items-center justify-center border-4 border-[#FF0033]">
              <MoveHorizontal className="w-5 h-5" />
            </div>
          </div>

          {/* Smooth Range Input */}
          <input
            type="range"
            min="2"
            max="98"
            value={sliderPos}
            onChange={(e) => setSliderPos(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
            aria-label="Compare before and after"
          />
        </div>
      </section>


      {/* Creator Testimonials */}
      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Ahmed — Gaming Channel (450K)",
              quote: "أنس حرفياً نقل القناة في حتة تانية! نسبة النقر (CTR) زادت من 5% لـ 12.8% في أول أسبوع شغل معاه."
            },
            {
              name: "Karim — Documentary & Science",
              quote: "بيفهم فكرة الفيديو بسرعة رهيبة وبيطلع ثامبنيل بأسلوب الدحيح يخطف العين من وسط آلاف الفيديوهات."
            },
            {
              name: "Omar — Business & Tech",
              quote: "التزام بالمواعيد، ألوان سينمائية نظيفة، وتجاوب سريع جداً على واتساب. أفضل مصمم تعاملت معاه."
            }
          ].map((rev, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-[#0D0D12] border border-white/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-[#F59E0B] mb-3">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} className="w-4 h-4 fill-[#F59E0B]" />
                  ))}
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed" dir="rtl">
                  "{rev.quote}"
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-white/5 text-xs font-black text-white">
                {rev.name}
              </div>
            </div>
          ))}
        </div>
      </section>
            {/* Packages Section */}
      <section id="packages" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-[#FF0033]">
            Ready to Scale?
          </span>
          <h2 className="text-3xl sm:text-4xl font-black mt-1">
            Creator-Friendly Packages
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 max-w-5xl mx-auto">
          {[
            {
              name: "Single Viral Thumbnail",
              desc: "Ideal for testing a single high-potential video",
              features: ["1 Custom High-CTR Thumbnail", "24-Hour Express Delivery", "Full HD 1920x1080 Export", "Unlimited Minor Revisions"],
              popular: false
            },
            {
              name: "Creator Growth Pack (5x)",
              desc: "Best value for consistent weekly uploads",
              features: ["5 Custom Thumbnails", "A/B Testing Color Variants", "Priority 24h Delivery", "Consistent Channel Style"],
              popular: true
            },
            {
              name: "Monthly Channel Partner",
              desc: "Your dedicated thumbnail studio",
              features: ["15–20 Thumbnails / Month", "Direct WhatsApp VIP Line", "Title + Thumbnail Ideation", "Highest Priority Queue"],
              popular: false
            }
          ].map((pkg, i) => (
            <div
              key={i}
              className={`relative p-7 rounded-3xl border flex flex-col justify-between transition transform hover:-translate-y-1 ${
                pkg.popular
                  ? "bg-gradient-to-b from-[#FF0033]/20 via-[#121217] to-[#0B0B0F] border-[#FF0033] shadow-2xl shadow-[#FF0033]/20"
                  : "bg-[#0D0D12] border-white/10"
              }`}
            >
              <div>
                {pkg.popular && (
                  <span className="inline-block px-3.5 py-1 rounded-full bg-gradient-to-r from-[#FF0033] to-rose-600 text-[11px] font-black tracking-wider mb-4">
                    MOST POPULAR
                  </span>
                )}
                <h3 className="text-xl font-black">{pkg.name}</h3>
                <p className="text-zinc-400 text-xs mt-1.5">{pkg.desc}</p>
                <ul className="mt-6 space-y-3.5 text-sm text-zinc-300">
                  {pkg.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#FF0033] shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={getWhatsappLink(`Hi Anas! I want to order the "${pkg.name}" package.`)}
                target="_blank"
                rel="noreferrer"
                className={`mt-8 w-full py-3.5 rounded-2xl font-black text-sm text-center transition flex items-center justify-center gap-2 ${
                  pkg.popular
                    ? "bg-gradient-to-r from-[#FF0033] to-rose-600 text-white shadow-lg shadow-[#FF0033]/30"
                    : "bg-white/10 hover:bg-white/15 text-white"
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order on WhatsApp</span>
              </a>
            </div>
          ))}
        </div>
      </section>


                {/* 4-Step Viral Workflow Section */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-[#F59E0B]">
            Smooth & Fast Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-black mt-1">
            How We Turn Your Idea Into Viral Clicks
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
             {
              step: "01",
              title: "Send Video Idea",
              desc: "Message me on WhatsApp with your video title, topic, and any raw photos."
            },

            {
              step: "02",
              title: "CTR Concept & Hook",
              desc: "We brainstorm a high-curiosity visual concept engineered to beat your competitors."
            },
            {
              step: "03",
              title: "Cinema-Grade Design",
              desc: "3D lighting, expressive color grading, and mobile-tested typography in under 24h."
            },
            {
              step: "04",
              title: "Launch & Scale Views",
              desc: "Receive your Full-HD thumbnail (plus A/B variants) and watch your CTR skyrocket."
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="relative p-6 rounded-3xl bg-[#0D0D12] border border-white/10 hover:border-[#F59E0B]/50 transition group"
            >
              <span className="text-5xl font-black text-white/5 group-hover:text-[#FF0033]/20 transition select-none">
                {item.step}
              </span>
              <h3 className="text-lg font-black text-white mt-2">{item.title}</h3>
              <p className="text-zinc-400 text-xs leading-relaxed mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive FAQ Accordion */}
      <section className="py-14 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-black uppercase tracking-widest text-[#FF0033]">
            Got Questions?
          </span>
          <h2 className="text-3xl font-black mt-1">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: "How fast will I receive my thumbnail?",
              a: "Standard delivery is within 24 hours. For urgent uploads or monthly partners, express delivery takes as little as 6–12 hours."
            },
            {
              q: "What if I want changes or revisions?",
              a: "Every order includes unlimited minor revisions (colors, text tweaks, facial expressions) until you are 100% satisfied."
            },
            {
              q: "Do you provide A/B testing variations?",
              a: "Yes! You can request color or text variations so you can use YouTube's Test & Compare feature to maximize your CTR."
            },
            {
              q: "How do I pay and start an order?",
              a: "Simply click any WhatsApp button on this page to message me directly. Payment is fast and easy via InstaPay."
            }
          ].map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#0D0D12] border border-white/10 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                className="w-full px-6 py-4 text-left flex items-center justify-between font-bold text-sm sm:text-base text-white hover:text-[#FF0033] transition"
              >
                <span>{faq.q}</span>
                <span className="text-xl font-black text-[#FF0033]">
                  {openFaq === idx ? "−" : "+"}
                </span>
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-4 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-white/5 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Ultimate Final CTA Banner */}
      <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="relative rounded-[32px] p-8 sm:p-14 overflow-hidden border border-[#FF0033]/40 bg-gradient-to-br from-[#FF0033]/20 via-[#121217] to-[#F59E0B]/15 text-center shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              Ready to Make Your Next Video Go Viral?
            </h2>
            <p className="text-zinc-300 text-sm sm:text-base mt-4">
              Don't let great content die with a weak thumbnail. Message me now and get your first high-CTR design within 24 hours.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href={getWhatsappLink("Hi Anas! I'm ready to order my viral thumbnail now.")}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 bg-gradient-to-r from-[#FF0033] to-rose-600 hover:from-rose-600 hover:to-[#FF0033] text-white font-black px-8 py-4 rounded-2xl shadow-2xl shadow-[#FF0033]/40 transition transform hover:scale-105"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Order Now on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer (No Twitter/X) */}
      <footer id="contact" className="border-t border-white/10 bg-[#040406] py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="font-black text-xl tracking-wider">
              ANAS <span className="text-[#FF0033]">SAYED</span>
            </div>
            <p className="text-zinc-400 text-sm mt-1">
              YouTube Thumbnail Designer • WhatsApp: {designerInfo.whatsappNumber}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCopyPhone}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold transition"
            >
              {copiedPhone ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedPhone ? "Copied!" : designerInfo.whatsappNumber}</span>
            </button>

            <a
              href={getWhatsappLink("Hi Anas, I want to work with you on my YouTube thumbnails!")}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition shadow-lg shadow-emerald-600/20"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Direct</span>
            </a>
          </div>
        </div>
      </footer>
            {/* Floating WhatsApp Quick Action Button */}
      <a
        href={getWhatsappLink("Hi Anas! I'm on your portfolio and want to order a thumbnail.")}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black px-5 py-3.5 rounded-full shadow-2xl shadow-emerald-500/40 transition transform hover:scale-105"
      >
        <MessageCircle className="w-5 h-5 fill-zinc-950" />
        <span className="text-xs sm:text-sm">Chat with Me</span>

      </a>

      {/* YouTube Feed Preview Lightbox Modal */}
            {/* YouTube Feed Preview Lightbox Modal */}
      {previewItem && (
        <div
          onClick={() => setPreviewItem(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`border rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl transition-colors ${
              ytDarkMode
                ? "bg-[#0F0F0F] border-white/15 text-white"
                : "bg-white border-zinc-200 text-zinc-900"
            }`}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-current/10">
              <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                YouTube Feed Simulation Preview
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setYtDarkMode(!ytDarkMode)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-current/10 text-xs font-bold"
                >
                  {ytDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
                  <span>{ytDarkMode ? "Light Mode" : "Dark Mode"}</span>
                </button>
                <button
                  onClick={() => setPreviewItem(null)}
                  className="p-1.5 rounded-lg bg-current/10 hover:opacity-80"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={previewItem.image_url}
                  alt={previewItem.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mt-5 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#FF0033] to-[#F59E0B] text-white flex items-center justify-center font-black text-sm shrink-0">
                    AS
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-snug">
                      {previewItem.title}
                    </h3>
                    <p className="text-xs opacity-60 mt-1">
                      Anas Sayed • {previewItem.views_ctr || "1.2M views"} • 2 hours ago
                    </p>
                  </div>
                </div>

                <a
                  href={getWhatsappLink(`Hi Anas! I want a thumbnail similar to "${previewItem.title}".`)}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 flex items-center gap-2 bg-[#FF0033] hover:bg-rose-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-[#FF0033]/30"
                >
                  <span>Order Similar Style</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Admin Dashboard Modal */}
      {isAdminOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-[#121217] border border-white/15 rounded-3xl max-w-4xl w-full p-6 my-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#FF0033]" />
                <h2 className="font-black text-lg">Anas Sayed — Thumbnail Manager</h2>
              </div>
              <div className="flex items-center gap-2">
                {isAuthenticated && (
                  <button
                    onClick={() => setIsAuthenticated(false)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400"
                    title="Lock Dashboard"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsAdminOpen(false)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {!isAuthenticated ? (
              <form onSubmit={handleAdminLogin} className="max-w-sm mx-auto py-12 space-y-4">
                <h3 className="text-center font-bold text-lg">Admin Login</h3>
                <p className="text-center text-xs text-zinc-400">
  Enter password to manage portfolio thumbnails
</p>

                <input
                  type="password"
                  placeholder="Enter Admin Password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm focus:border-[#FF0033] outline-none"
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#FF0033] hover:bg-rose-600 font-bold text-sm transition"
                >
                  Unlock Dashboard
                </button>
              </form>
            ) : (
              <div className="mt-6 space-y-8">
                {/* Add New Form */}
                <form
                  onSubmit={handleAddThumbnail}
                  className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4"
                >
                  <h3 className="font-bold text-sm text-[#F59E0B] flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add New Thumbnail
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Video / Thumbnail Title"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="px-4 py-2.5 rounded-xl bg-[#121217] border border-white/10 text-sm outline-none focus:border-[#FF0033]"
                      required
                    />
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="px-4 py-2.5 rounded-xl bg-[#121217] border border-white/10 text-sm outline-none focus:border-[#FF0033]"
                    >
                      {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Stats (e.g. 1.2M Views • 12.5% CTR)"
                      value={newStats}
                      onChange={(e) => setNewStats(e.target.value)}
                      className="px-4 py-2.5 rounded-xl bg-[#121217] border border-white/10 text-sm outline-none focus:border-[#FF0033]"
                    />
                    <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#121217] border border-dashed border-white/25 hover:border-[#FF0033] cursor-pointer text-xs text-zinc-300">
                      <Upload className="w-4 h-4 text-[#FF0033]" />
                      <span>{newFile ? newFile.name : "Upload Image File (JPG/PNG)"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setNewFile(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-6 py-2.5 rounded-xl bg-[#FF0033] hover:bg-rose-600 font-bold text-xs transition disabled:opacity-50"
                  >
                    {uploading ? "Uploading..." : "Publish Thumbnail"}
                  </button>
                </form>

                {/* Existing List */}
                <div>
                  <h3 className="font-bold text-sm mb-3">
                    Manage Thumbnails ({thumbnails.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-80 overflow-y-auto pr-1">
                    {thumbnails.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-black/40 border border-white/10"
                      >
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-20 h-12 object-cover rounded-lg shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold truncate">{item.title}</p>
                          <p className="text-[10px] text-zinc-400">{item.category}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteThumbnail(item.id)}
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 shrink-0"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
