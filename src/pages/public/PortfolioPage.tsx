import { useState, useEffect, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import { getPublishedProjects } from '@/services/projects'
import type { Project } from '@/types'
import ImageLightbox from '@/components/portfolio/ImageLightbox'

// Category Section Definition interface
interface CategorySection {
  id: string
  title: string
  titleAccent: string
  sectionNum: string
  subtitle: string
  pillBadge: string
  bannerTitle: string
  bannerColor: 'yellow' | 'purple' | 'none'
  layout: 'logo-grid' | 'board-grid' | 'social-grid' | 'thumb-grid' | 'aplus-grid' | 'banner-grid'
  items: PortfolioItem[]
}

interface PortfolioItem {
  id: string
  title: string
  slug: string
  image: string
  tag: string
  subtag?: string
  aspectRatio?: string
  likes?: string
  comments?: string
  handle?: string
}

// 1:1 Pixel-faithful data extracted directly from ui.jpeg
const UI_CATEGORIES: CategorySection[] = [
  // 01 LOGO DESIGN
  {
    id: 'logos',
    title: 'Logo',
    titleAccent: 'Design',
    sectionNum: '01',
    subtitle: 'LOGO MARKS  //  SELECTED IDENTITIES',
    pillBadge: '08 MARKS',
    bannerTitle: 'LogoFolio',
    bannerColor: 'purple',
    layout: 'logo-grid',
    items: [
      { id: 'l1', title: 'Creative Studio', slug: 'creative-studio-logo', image: '/portfolio-assets/logo_01_creative_studio.jpg', tag: 'MARK', subtag: 'LOGO 01' },
      { id: 'l2', title: 'Interior Furniture', slug: 'interior-furniture-logo', image: '/portfolio-assets/logo_02_interior.jpg', tag: 'MARK', subtag: 'LOGO 02' },
      { id: 'l3', title: 'New Smothis Spa', slug: 'smothis-beauty-spa-logo', image: '/portfolio-assets/logo_03_smothis.jpg', tag: 'MARK', subtag: 'LOGO 03' },
      { id: 'l4', title: 'Yogesh Training', slug: 'yogesh-stock-market-logo', image: '/portfolio-assets/logo_04_yogesh.jpg', tag: 'MARK', subtag: 'LOGO 04' },
      { id: 'l5', title: 'Arion Boutique', slug: 'arion-boutique-logo', image: '/portfolio-assets/logo_05_arion.jpg', tag: 'MARK', subtag: 'LOGO 05' },
      { id: 'l6', title: 'Skyline Design', slug: 'skyline-design-logo', image: '/portfolio-assets/logo_06_skyline.jpg', tag: 'MARK', subtag: 'LOGO 06' },
      { id: 'l7', title: 'Swan Boutique', slug: 'swan-boutique-logo', image: '/portfolio-assets/logo_07_swan.jpg', tag: 'MARK', subtag: 'LOGO 07' },
      { id: 'l8', title: 'Petal Workshop', slug: 'petal-workshop-logo', image: '/portfolio-assets/logo_08_petal.jpg', tag: 'MARK', subtag: 'LOGO 08' },
    ]
  },

  // 02 BRAND BOARDS
  {
    id: 'branding',
    title: 'Brand',
    titleAccent: 'Boards',
    sectionNum: '02',
    subtitle: 'MOCKUPS  //  STATIONERY  •  PACKAGING  •  DIGITAL',
    pillBadge: '06 SYSTEMS',
    bannerTitle: 'Branding',
    bannerColor: 'yellow',
    layout: 'board-grid',
    items: [
      { id: 'b1', title: 'Skyline Architecture System', slug: 'skyline-brand-board', image: '/portfolio-assets/board_01_skyline.jpg', tag: 'SYSTEM', subtag: 'BOARD 01' },
      { id: 'b2', title: 'Interior Furniture System', slug: 'interior-brand-board', image: '/portfolio-assets/board_02_interior.jpg', tag: 'SYSTEM', subtag: 'BOARD 02' },
      { id: 'b3', title: 'Swan Royal Blue System', slug: 'swan-brand-board', image: '/portfolio-assets/board_03_swan.jpg', tag: 'SYSTEM', subtag: 'BOARD 03' },
      { id: 'b4', title: 'Arion Luxury Pink System', slug: 'arion-brand-board', image: '/portfolio-assets/board_04_arion.jpg', tag: 'SYSTEM', subtag: 'BOARD 04' },
      { id: 'b5', title: 'Yogesh Black & Red System', slug: 'yogesh-brand-board', image: '/portfolio-assets/board_05_yogesh.jpg', tag: 'SYSTEM', subtag: 'BOARD 05' },
      { id: 'b6', title: 'Petal Workshop Floral System', slug: 'petal-brand-board', image: '/portfolio-assets/board_06_petal.jpg', tag: 'SYSTEM', subtag: 'BOARD 06' },
    ]
  },

  // 03 SOCIAL MEDIA CREATIVES
  {
    id: 'social',
    title: 'Social Media',
    titleAccent: 'Creatives',
    sectionNum: '03',
    subtitle: 'FEED  //  POSTS  •  STORIES  •  REELS  •  THUMBNAILS',
    pillBadge: '14 LIVE SLOTS',
    bannerTitle: 'Social Media',
    bannerColor: 'none',
    layout: 'social-grid',
    items: [
      { id: 's1', title: 'Target Market Campaign', slug: 'target-market-social', image: '/portfolio-assets/social_01_customer_market.jpg', tag: 'POST', handle: '@Poster', likes: '248' },
      { id: 's2', title: 'iNear Smart Watch Launch', slug: 'inear-smartwatch-social', image: '/portfolio-assets/social_02_inear_watch.jpg', tag: 'PRODUCT', handle: '@inear', likes: '48' },
      { id: 's3', title: 'Bharatworker Service Ad', slug: 'bharatworker-service-social', image: '/portfolio-assets/social_03_bharatworker.jpg', tag: 'POST', handle: '@Bharatworker', likes: '1,248' },
      { id: 's4', title: 'Manage Money In 20s', slug: 'money-in-20s-social', image: '/portfolio-assets/social_04_money_in_20s.jpg', tag: 'CAROUSEL', handle: '@yourbrand', likes: '148' },
      { id: 's5', title: 'UGC NET Economics Test', slug: 'ugc-net-economics-social', image: '/portfolio-assets/social_05_ecoholics_ugc.jpg', tag: 'AD', handle: '@ecoholics', likes: '848' },
      { id: 's6', title: 'Residential Plots Investment', slug: 'realestate-invest-social', image: '/portfolio-assets/social_06_realestate_invest.jpg', tag: 'POST', handle: '@realestate', likes: '48' },
      { id: 's7', title: 'Compassionate Family Matters', slug: 'family-support-social', image: '/portfolio-assets/social_07_family_support.jpg', tag: 'AD', handle: '@realestate', likes: '1,248' },
      { id: 's8', title: 'Invitation to Elevated Life', slug: 'elevated-life-social', image: '/portfolio-assets/social_08_elevated_life.jpg', tag: 'POST', handle: '@realestate', likes: '1,248' },
      { id: 's9', title: 'UGC NET Green Series', slug: 'ugc-net-green-social', image: '/portfolio-assets/social_09_ugc_net_green.jpg', tag: 'AD', handle: '@ecoholics', likes: '848' },
      { id: 's10', title: 'Monsoon Magic Jabalpur', slug: 'jabalpur-travel-social', image: '/portfolio-assets/social_10_jabalpur.jpg', tag: 'TRAVEL', handle: '@ecoholics', likes: '848' },
      { id: 's11', title: 'ShareWheels Luxury Car Look', slug: 'car-look-closer-social', image: '/portfolio-assets/social_11_car_look_closer.jpg', tag: 'AD', handle: '@ecoholics', likes: '848' },
      { id: 's12', title: 'Transparent Pricing App', slug: 'just-trust-social', image: '/portfolio-assets/social_12_just_trust.jpg', tag: 'APP', handle: '@ecoholics', likes: '848' },
      { id: 's13', title: 'Choose Book Drive UI Ad', slug: 'choose-book-drive-social', image: '/portfolio-assets/social_13_choose_book_drive.jpg', tag: 'APP', handle: '@ecoholics', likes: '848' },
      { id: 's14', title: 'Waiting on the App Promo', slug: 'waiting-on-app-social', image: '/portfolio-assets/social_14_waiting_on_app.jpg', tag: 'PROMO', handle: '@ecoholics', likes: '848' },
      { id: 's15', title: 'Power Your Moment Speaker', slug: 'power-moment-social', image: '/portfolio-assets/social_15_power_moment.jpg', tag: 'PRODUCT', handle: '@ecoholics', likes: '848' },
      { id: 's16', title: 'Oversized T-Shirt Fashion Ad', slug: 'oversized-tshirt-social', image: '/portfolio-assets/social_16_oversized_tshirt.jpg', tag: 'E-COMM', handle: '@ecoholics', likes: '848' }
    ]
  },

  // 04 THUMBNAILS
  {
    id: 'thumbnails',
    title: 'Thumbnails',
    titleAccent: '',
    sectionNum: '04',
    subtitle: 'CLICK-WORTHY COVERS  //  16:9  •  1920×1080',
    pillBadge: '04 SLOTS',
    bannerTitle: 'Thumbnails',
    bannerColor: 'yellow',
    layout: 'thumb-grid',
    items: [
      { id: 't1', title: 'Gas Subsidy Reality Exposed', slug: 'gas-subsidy-reality-thumbnail', image: '/portfolio-assets/thumb_01_gas_subsidy.jpg', tag: '16:9', subtag: 'THUMBNAIL 01' },
      { id: 't2', title: "BYJU'S Scam? Students. Money. Lies.", slug: 'byjus-scam-thumbnail', image: '/portfolio-assets/thumb_02_byjus_scam.jpg', tag: '16:9', subtag: 'THUMBNAIL 02' },
      { id: 't3', title: 'Evolution of Media & Propaganda', slug: 'evolution-of-media-thumbnail', image: '/portfolio-assets/thumb_03_evolution_media.jpg', tag: '16:9', subtag: 'THUMBNAIL 03' },
      { id: 't4', title: 'Education A Scam? High Fees Trap', slug: 'education-scam-thumbnail', image: '/portfolio-assets/thumb_04_education_scam.jpg', tag: '16:9', subtag: 'THUMBNAIL 04' }
    ]
  },

  // 05 A+ CONTENT
  {
    id: 'aplus',
    title: 'A+ Content',
    titleAccent: '',
    sectionNum: '05',
    subtitle: 'AMAZON PRODUCT LISTING  //  MODULE SLOTS  •  REAL RATIOS',
    pillBadge: '03 MODULE TYPES',
    bannerTitle: 'A+ Content',
    bannerColor: 'purple',
    layout: 'aplus-grid',
    items: [
      { id: 'a1', title: 'Smartwatch Feature Modules', slug: 'smartwatch-amazon-listing', image: '/portfolio-assets/aplus_01_smartwatch.jpg', tag: 'A+ MODULE', subtag: 'MODULE 01' },
      { id: 'a2', title: 'Wireless Split Speaker Specs', slug: 'split-speaker-amazon-listing', image: '/portfolio-assets/aplus_02_speaker.jpg', tag: 'A+ MODULE', subtag: 'MODULE 02' },
      { id: 'a3', title: 'Turmeric Ginger Herbal Supplements', slug: 'turmeric-supplements-listing', image: '/portfolio-assets/aplus_03_turmeric.jpg', tag: 'A+ MODULE', subtag: 'MODULE 03' },
      { id: 'a4', title: 'TPE Yoga Practice Mat Listing', slug: 'yoga-mat-amazon-listing', image: '/portfolio-assets/aplus_04_yoga_mat.jpg', tag: 'A+ MODULE', subtag: 'MODULE 04' },
      { id: 'a5', title: 'True Wireless Earbuds Listing', slug: 'earbuds-amazon-listing', image: '/portfolio-assets/aplus_05_earbuds.jpg', tag: 'A+ MODULE', subtag: 'MODULE 05' },
      { id: 'a6', title: '2-Slice Bread Toaster Module', slug: 'bread-toaster-amazon-listing', image: '/portfolio-assets/aplus_06_toaster.jpg', tag: 'A+ MODULE', subtag: 'MODULE 06' },
      { id: 'a7', title: 'Lenovo IdeaPad Slim 3 Specs', slug: 'lenovo-ideapad-amazon-listing', image: '/portfolio-assets/aplus_07_ideapad.jpg', tag: 'A+ MODULE', subtag: 'MODULE 07' },
      { id: 'a8', title: 'HP 15 Laptop Performance Listing', slug: 'hp-laptop-amazon-listing', image: '/portfolio-assets/aplus_08_hp_laptop.jpg', tag: 'A+ MODULE', subtag: 'MODULE 08' }
    ]
  },

  // 06 BANNERS
  {
    id: 'banners',
    title: 'Banners',
    titleAccent: '',
    sectionNum: '06',
    subtitle: 'WEBSITE HERO  //  AD BANNERS  •  1920×820',
    pillBadge: '02 SLOTS',
    bannerTitle: 'Banners',
    bannerColor: 'yellow',
    layout: 'banner-grid',
    items: [
      { id: 'bn1', title: 'Gourmet Indian Food Shop Promo', slug: 'food-shop-banner', image: '/portfolio-assets/banner_01_food_shop.jpg', tag: '1920×820', subtag: 'BANNER 01' },
      { id: 'bn2', title: 'Trust Cars Germany Dealership Billboard', slug: 'trust-cars-banner', image: '/portfolio-assets/banner_02_trust_cars.jpg', tag: '1920×820', subtag: 'BANNER 02' }
    ]
  }
]

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState<'ALL' | 'POSTS' | 'STORIES' | 'REELS' | 'THUMBNAILS'>('ALL')
  const [dbProjects, setDbProjects] = useState<Project[]>([])

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxItems, setLightboxItems] = useState<PortfolioItem[]>([])
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [originRect, setOriginRect] = useState<DOMRect | null>(null)
  const [activeItemId, setActiveItemId] = useState<string | null>(null)

  console.log('[MONITOR] PortfolioPage RENDER', { activeItemId, lightboxOpen, lightboxIndex })

  useEffect(() => {
    getPublishedProjects().then(setDbProjects).catch(console.error)
  }, [])

  const openLightbox = useCallback((items: PortfolioItem[], index: number, e?: React.MouseEvent<HTMLElement>) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    const item = items[index]
    const cardEl = document.getElementById(`portfolio-card-${item.id}`)
    const rect = cardEl ? cardEl.getBoundingClientRect() : null
    console.log('[MONITOR] openLightbox CLICKED', {
      itemId: item.id,
      rect: rect ? { left: rect.left, top: rect.top, width: rect.width, height: rect.height } : null
    })

    setLightboxItems(items)
    setLightboxIndex(index)
    setOriginRect(rect)
    setActiveItemId(item.id)
    setLightboxOpen(true)
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false)
  }, [])

  const navigateLightbox = useCallback((index: number) => {
    setLightboxIndex(index)
    if (lightboxItems[index]) {
      setActiveItemId(lightboxItems[index].id)
    }
  }, [lightboxItems])

  const handleLightboxExited = useCallback(() => {
    setActiveItemId(null)
    setOriginRect(null)
  }, [])

  return (
    <div className="bg-[#0b0c16] text-white min-h-screen selection:bg-amber-400 selection:text-ink font-sans">
      <Helmet>
        <title>Portfolio & Work Catalogue — Yash Chourey</title>
        <meta
          name="description"
          content="Official portfolio of Yash Chourey: Logo Design, Brand Boards, Social Media Creatives, Thumbnails, A+ Content, and High-Impact Banners."
        />
      </Helmet>

      {/* ======================================================== */}
      {/* 1. TOP HEADER / LOGOFOLIO HERO (Directly from ui.jpeg)   */}
      {/* ======================================================== */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 border-b border-white/5 overflow-hidden">
        {/* Subtle grid backdrop */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Top mini-bar from ui.jpeg */}
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono tracking-widest uppercase text-white/50 pb-8 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>PORTFOLIO / 2026</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-white/70">
            <a href="#logos" className="hover:text-amber-400 transition-colors">01 LOGOS</a>
            <a href="#branding" className="hover:text-amber-400 transition-colors">02 BRANDING</a>
            <a href="#social" className="hover:text-amber-400 transition-colors">03 SOCIAL</a>
            <a href="#thumbnails" className="hover:text-amber-400 transition-colors">04 THUMBNAILS</a>
            <a href="#aplus" className="hover:text-amber-400 transition-colors">05 A+ CONTENT</a>
            <a href="#banners" className="hover:text-amber-400 transition-colors">06 BANNERS</a>
          </div>

          <a
            href="#logos"
            className="px-3.5 py-1.5 rounded-full bg-amber-400 text-ink font-bold text-[11px] flex items-center gap-1.5 hover:bg-amber-300 transition-all"
          >
            <span>SCROLL</span>
            <span>↓</span>
          </a>
        </div>

        {/* Big 3D LogoFolio Banner */}
        <div className="max-w-5xl mx-auto text-center mt-12 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/70 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>SELECTED WORK  //  LOGOS • BRANDING • SOCIAL</span>
          </div>

          {/* Decorative Corner Framing from ui.jpeg */}
          <div className="relative py-8">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-400/60" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-400/60" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-amber-400/60" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-400/60" />

            <h1 className="font-display font-extrabold tracking-tight text-white select-none leading-none" style={{ fontSize: 'clamp(3.5rem, 12vw, 9.5rem)' }}>
              Logo<span className="text-[#05c46b] drop-shadow-[0_12px_24px_rgba(5,196,107,0.4)]">Folio</span>
            </h1>
          </div>

          <p className="text-sm sm:text-base text-white/60 mt-6 max-w-xl mx-auto leading-relaxed">
            Identity systems, logo marks and social creatives — crafted end to end.
          </p>

          {/* Metric Stats Pills */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-8">
            <div className="px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center gap-3">
              <span className="font-display font-bold text-amber-400 text-lg">08</span>
              <span className="text-xs font-mono uppercase tracking-wider text-white/70">LOGO MARKS</span>
            </div>
            <div className="px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center gap-3">
              <span className="font-display font-bold text-amber-400 text-lg">06</span>
              <span className="text-xs font-mono uppercase tracking-wider text-white/70">BRAND SYSTEMS</span>
            </div>
            <div className="px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center gap-3">
              <span className="font-display font-bold text-amber-400 text-lg">03</span>
              <span className="text-xs font-mono uppercase tracking-wider text-white/70">SOCIAL FORMATS</span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. DYNAMIC SLANTED RIBBON RUNNER FROM UI.JPEG            */}
      {/* ======================================================== */}
      <div className="relative py-4 overflow-hidden border-y border-white/5 my-2">
        <div className="bg-amber-400 text-ink py-2.5 font-display font-bold text-xs sm:text-sm tracking-wider uppercase flex whitespace-nowrap overflow-hidden select-none -rotate-[1deg] scale-105 shadow-md">
          <div className="flex animate-marquee gap-8 items-center">
            <span>BRANDING</span> • <span>SOCIAL MEDIA CREATIVES</span> • <span>VISUAL IDENTITY</span> • <span>LOGO DESIGN</span> • <span>BRANDING</span> • <span>SOCIAL MEDIA CREATIVES</span> • <span>VISUAL IDENTITY</span> • <span>LOGO DESIGN</span> • <span>BRANDING</span> • <span>SOCIAL MEDIA CREATIVES</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. SECTION 01: LOGO DESIGN                               */}
      {/* ======================================================== */}
      <section id="logos" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-white/10">
          <div>
            <span className="text-xs font-mono text-amber-400 font-bold block mb-1">01</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Logo Design
            </h2>
            <p className="text-xs font-mono tracking-widest uppercase text-white/50 mt-1">
              LOGO MARKS // SELECTED IDENTITIES
            </p>
          </div>
          <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/80 self-start sm:self-auto">
            • 08 MARKS
          </span>
        </div>

        {/* 4x2 Grid of Pure White Rounded Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {UI_CATEGORIES[0].items.map((item, idx) => (
            <button
              key={item.id}
              id={`portfolio-card-${item.id}`}
              onClick={(e) => openLightbox(UI_CATEGORIES[0].items, idx, e)}
              className={`group block rounded-3xl overflow-hidden bg-[#121320] border border-white/10 p-3 hover:border-amber-400/50 hover:shadow-xl transition-[border-color,box-shadow,transform] duration-300 will-change-transform text-left cursor-pointer ${
                activeItemId === item.id ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              <div className="aspect-square rounded-2xl overflow-hidden bg-white flex items-center justify-center p-3 relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="mt-3 px-2 flex items-center justify-between text-xs font-mono">
                <span className="text-white/60 tracking-wider text-[11px]">{item.subtag}</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold">
                  {item.tag}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. YELLOW BANNER BREAK: BRANDING                         */}
      {/* ======================================================== */}
      <div id="branding" className="relative my-12 bg-amber-400 text-ink py-20 px-4 text-center overflow-hidden">
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#000000 1px, transparent 1px), linear-gradient(90deg, #000000 1px, transparent 1px)`,
            backgroundSize: '36px 36px'
          }}
        />
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-ink text-white text-[11px] font-mono uppercase mb-4">
          <span>• 02 // BRAND IDENTITY SYSTEMS</span>
        </div>
        <h2 className="font-display font-extrabold text-5xl sm:text-7xl md:text-8xl tracking-tight text-white select-none drop-shadow-[0_8px_0_#2b2b4d]">
          Brand<span className="text-ink">ing</span>
        </h2>
      </div>

      {/* ======================================================== */}
      {/* 5. SECTION 02: BRAND BOARDS                              */}
      {/* ======================================================== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-white/10">
          <div>
            <span className="text-xs font-mono text-amber-400 font-bold block mb-1">02</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Brand Boards
            </h2>
            <p className="text-xs font-mono tracking-widest uppercase text-white/50 mt-1">
              MOCKUPS // STATIONERY • PACKAGING • DIGITAL
            </p>
          </div>
          <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/80 self-start sm:self-auto">
            • 06 SYSTEMS
          </span>
        </div>

        {/* 3x2 Grid of Tall Brand System Boards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {UI_CATEGORIES[1].items.map((item, idx) => (
            <button
              key={item.id}
              id={`portfolio-card-${item.id}`}
              onClick={(e) => openLightbox(UI_CATEGORIES[1].items, idx, e)}
              className={`group block rounded-3xl overflow-hidden bg-[#121320] border border-white/10 p-3 hover:border-amber-400/50 hover:shadow-2xl transition-[border-color,box-shadow,transform] duration-300 will-change-transform text-left cursor-pointer ${
                activeItemId === item.id ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              <div className="aspect-[3/5] rounded-2xl overflow-hidden bg-black/40 relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="mt-4 px-2 flex items-center justify-between text-xs font-mono">
                <span className="text-white/60 tracking-wider text-[11px]">{item.subtag}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-ink text-[10px] font-bold">
                  {item.tag}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. SECTION 03: SOCIAL MEDIA CREATIVES                    */}
      {/* ======================================================== */}
      <section id="social" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-white/10">
          <div>
            <span className="text-xs font-mono text-amber-400 font-bold block mb-1">03</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Social Media Creatives
            </h2>
            <p className="text-xs font-mono tracking-widest uppercase text-white/50 mt-1">
              FEED // POSTS • STORIES • REELS • THUMBNAILS
            </p>
          </div>
          <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/80 self-start sm:self-auto">
            • 14 LIVE SLOTS
          </span>
        </div>

        {/* Filter Pills from ui.jpeg */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          {(['ALL', 'POSTS', 'STORIES', 'REELS', 'THUMBNAILS'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all ${
                activeTab === tab
                  ? 'bg-amber-400 text-ink font-bold shadow-md'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 4x4 Grid of Phone/Post Frames */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {UI_CATEGORIES[2].items.map((item, idx) => (
            <button
              key={item.id}
              id={`portfolio-card-${item.id}`}
              onClick={(e) => openLightbox(UI_CATEGORIES[2].items, idx, e)}
              className={`group block rounded-3xl overflow-hidden bg-[#121320] border border-white/10 p-2 sm:p-3 hover:border-amber-400/50 hover:shadow-xl transition-[border-color,box-shadow,transform] duration-300 will-change-transform text-left cursor-pointer ${
                activeItemId === item.id ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              {/* Instagram Phone Mock Frame */}
              <div className="rounded-2xl overflow-hidden bg-[#0c0d15] border border-white/5 flex flex-col">
                {/* Simulated Post Top Bar */}
                <div className="px-3 py-2 flex items-center justify-between text-[11px] text-white/80 border-b border-white/5">
                  <span className="font-mono">{item.handle || '@yashchourey'}</span>
                  <span>•••</span>
                </div>
                {/* Post Image */}
                <div className="aspect-[4/5] overflow-hidden bg-black relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                {/* Simulated Post Bottom Action Bar */}
                <div className="px-3 py-2 flex items-center justify-between text-[11px] text-white/60">
                  <div className="flex items-center gap-2">
                    <span>♡</span>
                    <span>💬</span>
                    <span>↗</span>
                  </div>
                  <span className="text-[10px] font-mono">{item.likes} likes</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. YELLOW BANNER BREAK: THUMBNAILS                       */}
      {/* ======================================================== */}
      <div id="thumbnails" className="relative my-12 bg-amber-400 text-ink py-20 px-4 text-center overflow-hidden">
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#000000 1px, transparent 1px), linear-gradient(90deg, #000000 1px, transparent 1px)`,
            backgroundSize: '36px 36px'
          }}
        />
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-ink text-white text-[11px] font-mono uppercase mb-4">
          <span>• 04 // THUMBNAIL DESIGN</span>
        </div>
        <h2 className="font-display font-extrabold text-5xl sm:text-7xl md:text-8xl tracking-tight text-white select-none drop-shadow-[0_8px_0_#2b2b4d]">
          Thumb<span className="text-[#05c46b]">nails</span>
        </h2>
      </div>

      {/* ======================================================== */}
      {/* 8. SECTION 04: THUMBNAILS (16:9 Grid)                    */}
      {/* ======================================================== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-white/10">
          <div>
            <span className="text-xs font-mono text-amber-400 font-bold block mb-1">04</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Thumbnails
            </h2>
            <p className="text-xs font-mono tracking-widest uppercase text-white/50 mt-1">
              CLICK-WORTHY COVERS // 16:9 • 1920×1080
            </p>
          </div>
          <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/80 self-start sm:self-auto">
            • 04 SLOTS
          </span>
        </div>

        {/* 2x2 Grid of 16:9 Cinematic Video Thumbnails */}
        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
          {UI_CATEGORIES[3].items.map((item, idx) => (
            <button
              key={item.id}
              id={`portfolio-card-${item.id}`}
              onClick={(e) => openLightbox(UI_CATEGORIES[3].items, idx, e)}
              className={`group block rounded-3xl overflow-hidden bg-[#121320] border border-white/10 p-3 hover:border-amber-400/50 hover:shadow-2xl transition-[border-color,box-shadow,transform] duration-300 will-change-transform text-left cursor-pointer ${
                activeItemId === item.id ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              <div className="aspect-video rounded-2xl overflow-hidden bg-black relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="mt-3 px-2 flex items-center justify-between text-xs font-mono">
                <span className="text-white/60 tracking-wider text-[11px]">{item.subtag}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-ink text-[10px] font-bold">
                  {item.tag}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 9. PURPLE BANNER BREAK: A+ CONTENT                       */}
      {/* ======================================================== */}
      <div id="aplus" className="relative my-12 bg-[#3f3b77] text-white py-20 px-4 text-center overflow-hidden">
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
            backgroundSize: '36px 36px'
          }}
        />
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/40 text-white text-[11px] font-mono uppercase mb-4">
          <span>• 05 // AMAZON LISTING • A+ CONTENT</span>
        </div>
        <h2 className="font-display font-extrabold text-5xl sm:text-7xl md:text-8xl tracking-tight text-white select-none drop-shadow-[0_8px_0_#1b183a]">
          A+ <span className="text-amber-400">Content</span>
        </h2>
      </div>

      {/* ======================================================== */}
      {/* 10. SECTION 05: A+ CONTENT                               */}
      {/* ======================================================== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-white/10">
          <div>
            <span className="text-xs font-mono text-amber-400 font-bold block mb-1">05</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
              A+ Content
            </h2>
            <p className="text-xs font-mono tracking-widest uppercase text-white/50 mt-1">
              AMAZON PRODUCT LISTING // MODULE SLOTS • REAL RATIOS
            </p>
          </div>
          <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/80 self-start sm:self-auto">
            • 03 MODULE TYPES
          </span>
        </div>

        {/* 4x2 Grid of Product Module Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {UI_CATEGORIES[4].items.map((item, idx) => (
            <button
              key={item.id}
              id={`portfolio-card-${item.id}`}
              onClick={(e) => openLightbox(UI_CATEGORIES[4].items, idx, e)}
              className={`group block rounded-3xl overflow-hidden bg-[#121320] border border-white/10 p-2 sm:p-3 hover:border-amber-400/50 hover:shadow-xl transition-[border-color,box-shadow,transform] duration-300 will-change-transform text-left cursor-pointer ${
                activeItemId === item.id ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              <div className="aspect-[9/16] rounded-2xl overflow-hidden bg-black relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="mt-3 px-2 flex items-center justify-between text-xs font-mono">
                <span className="text-white/60 tracking-wider text-[11px]">{item.subtag}</span>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                  {item.tag}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 11. YELLOW BANNER BREAK: BANNERS                         */}
      {/* ======================================================== */}
      <div id="banners" className="relative my-12 bg-amber-400 text-ink py-20 px-4 text-center overflow-hidden">
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#000000 1px, transparent 1px), linear-gradient(90deg, #000000 1px, transparent 1px)`,
            backgroundSize: '36px 36px'
          }}
        />
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-ink text-white text-[11px] font-mono uppercase mb-4">
          <span>• 06 // WEB & AD BANNERS</span>
        </div>
        <h2 className="font-display font-extrabold text-5xl sm:text-7xl md:text-8xl tracking-tight text-white select-none drop-shadow-[0_8px_0_#2b2b4d]">
          Banner<span className="text-[#05c46b]">s</span>
        </h2>
      </div>

      {/* ======================================================== */}
      {/* 12. SECTION 06: BANNERS (Ultra-wide billboard cards)     */}
      {/* ======================================================== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-32">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-white/10">
          <div>
            <span className="text-xs font-mono text-amber-400 font-bold block mb-1">06</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Banners
            </h2>
            <p className="text-xs font-mono tracking-widest uppercase text-white/50 mt-1">
              WEBSITE HERO // AD BANNERS • 1920×820
            </p>
          </div>
          <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/80 self-start sm:self-auto">
            • 02 SLOTS
          </span>
        </div>

        {/* Stack of Ultra-wide Banners */}
        <div className="space-y-8">
          {UI_CATEGORIES[5].items.map((item, idx) => (
            <button
              key={item.id}
              id={`portfolio-card-${item.id}`}
              onClick={(e) => openLightbox(UI_CATEGORIES[5].items, idx, e)}
              className={`group block w-full rounded-3xl overflow-hidden bg-[#121320] border border-white/10 p-3 sm:p-4 hover:border-amber-400/50 hover:shadow-2xl transition-[border-color,box-shadow,transform] duration-300 will-change-transform text-left cursor-pointer ${
                activeItemId === item.id ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              <div className="aspect-[1920/820] rounded-2xl overflow-hidden bg-black relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                />
              </div>
              <div className="mt-3 px-2 flex items-center justify-between text-xs font-mono">
                <span className="text-white/60 tracking-wider text-[11px]">{item.subtag}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-ink text-[10px] font-bold">
                  {item.tag}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 13. BOTTOM BAR (Directly from ui.jpeg footer)             */}
      {/* ======================================================== */}
      <footer className="border-t border-white/10 py-6 px-4 sm:px-8 bg-black/60">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/60">
          <div>
            PORTFOLIO / 2026 // LOGOS • BRANDING • SOCIAL • THUMBNAILS • A+ • BANNERS
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-4 py-2 rounded-full bg-amber-400 text-ink font-bold flex items-center gap-1.5 hover:bg-amber-300 transition-all"
          >
            <span>BACK TO TOP</span>
            <span>↑</span>
          </button>
        </div>
      </footer>

      {/* ======================================================== */}
      {/* LIGHTBOX OVERLAY                                          */}
      {/* ======================================================== */}
      <ImageLightbox
        isOpen={lightboxOpen}
        items={lightboxItems}
        currentIndex={lightboxIndex}
        originRect={originRect}
        onClose={closeLightbox}
        onNavigate={navigateLightbox}
        onExited={handleLightboxExited}
      />
    </div>
  )
}
