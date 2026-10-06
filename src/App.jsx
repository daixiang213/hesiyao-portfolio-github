import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BlurText from './components/BlurText';
import ScrollFloat from './components/ScrollFloat';

gsap.registerPlugin(ScrollTrigger);

const scrollFloatProps = {
  animationDuration: 1,
  ease: 'back.inOut(2)',
  scrollStart: 'top bottom-=5%',
  scrollEnd: 'top center+=5%',
  stagger: 0.04,
};

const profile = {
  name: '何思瑶',
  city: '杭州',
  phone: '18213747974',
  experience: '两年从业经验',
  intro:
    '在杭州从事化妆造型工作两年，曾在杭州黑珍珠化妆学校接受专业培训。擅长韩系清透妆、亚裔时尚妆、杂志风造型和新娘妆，能够结合客户的脸型、五官、肤质、服装与拍摄主题设计妆面。重视底妆质感、细节完成度与镜头表现，能够完成妆前沟通、现场调整和补妆。',
};

const navItems = [
  { label: '首页', href: '#home' },
  { label: '经历', href: '#profile' },
  { label: '妆面', href: '#work' },
  { label: '优势', href: '#strengths' },
  { label: '联系', href: '#contact' },
];

const stats = [
  { value: '2年', label: '杭州化妆造型经验' },
  { value: '7类', label: '核心妆面方向' },
  { value: '1.5年', label: '自由接单与项目实践' },
];

const makeupTypes = [
  {
    id: 'bridal',
    title: '新娘妆',
    subtitle: 'Bridal Beauty',
    copy: '根据婚纱款式、婚礼场景和人物气质定制妆发，把控仪式、跟拍与近景镜头下的精致度和持久度。',
  },
  {
    id: 'editorial',
    title: '杂志风',
    subtitle: 'Editorial',
    copy: '围绕主题、服装和光线建立妆面叙事，用更鲜明的结构、质感和色彩完成具有编辑感的视觉表达。',
  },
  {
    id: 'asian',
    title: '亚裔妆',
    subtitle: 'Asian Beauty',
    copy: '根据东方五官特征优化眉眼、轮廓与肤色，在保留人物辨识度的同时提升时尚感和镜头表现。',
  },
  {
    id: 'korean',
    title: '韩系妆',
    subtitle: 'K-Beauty',
    copy: '以清透底妆、自然眉形、卧蚕提亮和低饱和色彩塑造干净、轻盈且亲和的妆面氛围。',
  },
  {
    id: 'thai',
    title: '泰系妆',
    subtitle: 'Thai Glam',
    copy: '通过立体轮廓、浓密睫毛和饱满色彩强化五官存在感，在明艳气场与精致质感之间保持平衡。',
  },
  {
    id: 'western',
    title: '欧美妆',
    subtitle: 'Western Glam',
    copy: '强调骨相结构、眼部层次和唇妆比例，让轮廓更清晰、气场更鲜明，同时保持妆面的细腻度。',
  },
  {
    id: 'new-chinese',
    title: '新中式',
    subtitle: 'New Chinese',
    copy: '结合东方色彩、留白与现代轮廓语言，在传统意蕴和当代审美之间建立克制而有辨识度的造型。',
  },
];

const makeupPages = [makeupTypes.slice(0, 3), makeupTypes.slice(3)];

const imagePaths = (category, subject, count) =>
  Array.from({ length: count }, (_, index) => `/portfolio/${category}/${subject}/${String(index + 1).padStart(2, '0')}.jpg`);

const portfolioAlbums = {
  bridal: [{ id: '01', images: imagePaths('bridal', '01', 6) }],
  editorial: [
    { id: '01', images: imagePaths('editorial', '01', 5) },
    { id: '02', images: imagePaths('editorial', '02', 7) },
  ],
  asian: [],
  korean: [
    { id: '01', images: imagePaths('korean', '01', 5) },
    { id: '02', images: imagePaths('korean', '02', 5) },
  ],
  thai: [{ id: '01', images: imagePaths('thai', '01', 4) }],
  western: [],
  'new-chinese': [{ id: '01', images: imagePaths('new-chinese', '01', 6) }],
};

const portfolioCovers = {
  bridal: '/portfolio/bridal/01/03.jpg',
  editorial: '/portfolio/editorial/02/05.jpg',
  korean: '/portfolio/korean/02/01.jpg',
  thai: '/portfolio/thai/01/01.jpg',
  'new-chinese': '/portfolio/new-chinese/01/04.jpg',
};

const defaultPortrait = '/portfolio/editorial/02/02.jpg';

const strengths = [
  { title: '风格判断', text: '不机械套用模板，会结合脸型、五官比例、肤质、服装与拍摄主题判断妆面重点，在流行趋势与个人辨识度之间找到平衡。' },
  { title: '镜头细节', text: '重视底妆的干净与服帖、眉眼结构、色彩衔接及近景质感，让妆容在自然光和镜头特写下都保持完整。' },
  { title: '沟通定制', text: '妆前充分确认需求与偏好，把专业建议讲清楚，并根据人物状态及时调整，让整个服务过程更安心、高效。' },
  { title: '现场执行', text: '熟悉拍摄节奏，能与摄影、造型团队顺畅配合，及时完成补妆、改妆和细节修正，保证不同造型衔接稳定。' },
];

const career = [
  {
    title: 'Dimpool 摄影工作室',
    meta: '化妆师 · 杭州 · 2025年4月-12月',
    detail: '根据客人喜好推荐适合妆容，完成到店换衣、多套妆造变换，把控上镜效果和妆面持久度。',
  },
  {
    title: '美人纪婚纱摄影',
    meta: '化妆助理 · 杭州 · 2025年4月-7月',
    detail: '配合化妆老师完成妆容，负责化妆桌日常卫生，并邀请互勉模特到工作室共同出作品。',
  },
  {
    title: '自由接单及项目实践',
    meta: '化妆师 · 杭州 · 1年半',
    detail: '为个人写真、日常约妆、活动造型及婚纱拍摄提供化妆服务，完成妆前沟通、现场调整和后续补妆。',
  },
];

const storageKeys = {
  work: 'hesiyao.workImages',
};

function readStoredValue(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function normalizeWorkImages(value) {
  return Object.fromEntries(
    Object.entries(value || {}).map(([key, images]) => [key, Array.isArray(images) ? images : images ? [images] : []]),
  );
}

function App() {
  const portrait = defaultPortrait;
  const [workImages] = useState(() => normalizeWorkImages(readStoredValue(storageKeys.work, {})));
  const [viewer, setViewer] = useState(null);
  const pointerStart = useRef(null);
  const years = useMemo(() => new Date().getFullYear(), []);

  const viewerItem = viewer ? makeupTypes.find((item) => item.id === viewer.id) : null;
  const viewerAlbums = viewerItem ? getCategoryAlbums(viewerItem.id) : [];
  const viewerAlbumIndex = viewerAlbums.length ? Math.min(viewer?.albumIndex || 0, viewerAlbums.length - 1) : 0;
  const viewerAlbum = viewerAlbums[viewerAlbumIndex];
  const viewerImages = viewerAlbum?.images || [];
  const viewerIndex = viewerImages.length ? Math.min(viewer?.index || 0, viewerImages.length - 1) : 0;

  function getCategoryAlbums(id) {
    const bundled = portfolioAlbums[id] || [];
    const custom = workImages[id] || [];
    return custom.length ? [...bundled, { id: '自定义', images: custom }] : bundled;
  }

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const cardElements = gsap.utils.toArray(
        '.portrait-panel, .stat, .career-list article, .makeup-card, .strength-grid article',
      );
      const textElements = gsap.utils.toArray([
        '.section-kicker',
        '.profile-copy > .overline',
        '.profile-copy > p:not(.overline)',
        '.contact-strip > *',
        '.stat > *',
        '.career-list article > *',
        '.section-head .overline',
        '.section-head > p',
        '.makeup-card-copy > *',
        '.strength-grid article > h3',
        '.strength-grid article > p',
        '.finale-topline > *',
        '.contact-finale .overline',
        '.contact-finale .finale-inner > p:not(.overline)',
        '.final-actions > *',
        '.contact-finale footer > *',
      ].join(','));

      gsap.set(cardElements, {
        autoAlpha: 0,
        y: 96,
        scale: 0.94,
        transformOrigin: '50% 0%',
        force3D: true,
      });
      ScrollTrigger.batch(cardElements, {
        start: 'top 94%',
        onEnter: (batch) => gsap.to(batch, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 1.05,
          ease: 'power4.out',
          stagger: 0.1,
          overwrite: true,
          force3D: true,
        }),
        onLeaveBack: (batch) => gsap.set(batch, { autoAlpha: 0, y: 96, scale: 0.94 }),
      });

      gsap.set(textElements, {
        autoAlpha: 0,
        yPercent: 85,
        scaleY: 1.45,
        scaleX: 0.9,
        transformOrigin: '50% 0%',
        force3D: true,
      });
      ScrollTrigger.batch(textElements, {
        start: 'top 96%',
        onEnter: (batch) => gsap.to(batch, {
          autoAlpha: 1,
          yPercent: 0,
          scaleY: 1,
          scaleX: 1,
          duration: 0.95,
          ease: 'power4.out',
          stagger: 0.045,
          overwrite: true,
          force3D: true,
        }),
        onLeaveBack: (batch) => gsap.set(batch, {
          autoAlpha: 0,
          yPercent: 85,
          scaleY: 1.45,
          scaleX: 0.9,
        }),
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    return () => context.revert();
  }, []);

  useEffect(() => {
    if (!viewer) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKey = (event) => {
      if (event.key === 'Escape') setViewer(null);
      if (event.key === 'ArrowLeft') shiftViewer(-1);
      if (event.key === 'ArrowRight') shiftViewer(1);
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [viewer, viewerImages.length]);

  function shiftViewer(delta) {
    if (!viewerImages.length) return;
    setViewer((current) => ({ ...current, index: ((current.index || 0) + delta + viewerImages.length) % viewerImages.length }));
  }

  function handlePointerDown(event) {
    pointerStart.current = event.clientX;
  }

  function handlePointerUp(event) {
    if (pointerStart.current === null) return;
    const distance = event.clientX - pointerStart.current;
    pointerStart.current = null;
    if (Math.abs(distance) > 55) shiftViewer(distance > 0 ? -1 : 1);
  }

  return (
    <main className="site-shell">
      <div className="ambient-video-layer" aria-hidden="true">
        <video autoPlay muted loop playsInline preload="metadata">
          <source src="/portfolio-background.mp4" type="video/mp4" />
        </video>
      </div>

      <header className="topbar">
        <BlurText as="a" className="brand-mark" href="#home" aria-label="何思瑶作品集首页" text="HSY" animateBy="letters" delay={45} startDelay={80} />
        <nav aria-label="主导航">
          <span className="nav-dot" aria-hidden="true" />
          {navItems.map((item, index) => (
            <BlurText as="a" key={item.href} href={item.href} text={item.label} animateBy="letters" delay={45} startDelay={160 + index * 75} />
          ))}
        </nav>
        <BlurText as="a" className="contact-pill" href={`tel:${profile.phone}`} text="联系预约" animateBy="letters" delay={55} startDelay={560} />
      </header>

      <section className="hero" id="home" aria-label="首页">
        <div className="hero-media" aria-hidden="true">
          <img className="hero-cover" src="/hero-editorial.jpg" alt="" />
          <div className="hero-wash" />
          <div className="film-grain" />
        </div>

        <div className="hero-inner page-width">
          <div className="hero-title-block">
            <BlurText as="p" className="eyebrow" text="Hangzhou · Makeup Artist · 2026" animateBy="words" delay={85} startDelay={120} />
            <h1>
              <BlurText text="何思瑶" animateBy="letters" direction="bottom" delay={130} startDelay={280} />
              <BlurText as="small" text="HE SIYAO" animateBy="letters" direction="bottom" delay={65} startDelay={650} />
            </h1>
          </div>
          <div className="hero-lower">
            <BlurText as="p" className="hero-copy" text={'让妆面保留人的辨识度，\n也经得起镜头的靠近。'} animateBy="letters" direction="bottom" delay={34} startDelay={720} stepDuration={0.42} />
            <div className="hero-actions">
              <BlurText as="a" className="primary-btn" href="#work" text="浏览精选妆面" animateBy="letters" direction="bottom" delay={48} startDelay={980} />
            </div>
          </div>
        </div>
        <div className="hero-meta page-width">
          <BlurText text="Editorial / 2026" animateBy="words" direction="bottom" delay={60} startDelay={1120} />
          <BlurText text="Scroll to explore" animateBy="words" direction="bottom" delay={60} startDelay={1200} />
        </div>
      </section>

      <section className="profile-section page-width" id="profile" data-reveal>
        <div className="section-kicker"><span>01</span> Profile</div>
        <div className="profile-grid">
          <div className="portrait-panel">
            {portrait ? <img src={portrait} alt="何思瑶人物图" /> : (
              <div className="portrait-placeholder" aria-label="人物图占位"><span>HSY</span><small>Portrait ready</small></div>
            )}
          </div>

          <div className="profile-copy">
            <p className="overline">About &amp; Experience</p>
            <ScrollFloat {...scrollFloatProps}>妆面服务于人物，细节服务于镜头。</ScrollFloat>
            <p>{profile.intro}</p>
            <div className="contact-strip" aria-label="基本联系信息">
              <span>{profile.city}</span><span>{profile.experience}</span><a href={`tel:${profile.phone}`}>{profile.phone}</a>
            </div>
            <div className="stats-grid">
              {stats.map((item) => <div className="stat" key={item.label}><strong>{item.value}</strong><span>{item.label}</span></div>)}
            </div>
          </div>
        </div>

        <div className="career-list" aria-label="工作经历">
          {career.map((item) => (
            <article key={item.title}><div><h3>{item.title}</h3><p>{item.meta}</p></div><p>{item.detail}</p></article>
          ))}
        </div>
      </section>

      <section className="work-section" id="work" data-reveal>
        <div className="page-width">
          <div className="section-kicker"><span>02</span> Selected Looks</div>
          <div className="section-head">
            <div><p className="overline">Seven Collections</p><ScrollFloat {...scrollFloatProps}>精选妆面画册</ScrollFloat></div>
            <p>点击卡片进入全屏画册，可切换模特分组并左右浏览完整作品</p>
          </div>

          <div className="makeup-pages">
            {makeupPages.map((items, pageIndex) => (
              <div className="makeup-page" key={`page-${pageIndex + 1}`}>
                <div className="makeup-page-index"><span>Collection page</span><strong>0{pageIndex + 1} / 02</strong></div>
                <div className="makeup-grid">
            {items.map((item, localIndex) => {
              const index = pageIndex * 3 + localIndex;
              const albums = getCategoryAlbums(item.id);
              const cover = portfolioCovers[item.id] || albums[0]?.images[0];
              const coverAlbumIndex = Math.max(0, albums.findIndex((album) => album.images.includes(cover)));
              const totalImages = albums.reduce((total, album) => total + album.images.length, 0);
              return (
                <article className="makeup-card" key={item.id} data-index={String(index + 1).padStart(2, '0')}>
                  <div
                    className={`album-viewport ${cover ? 'has-images' : 'no-images'}`}
                    onClick={() => cover && setViewer({ id: item.id, albumIndex: coverAlbumIndex, index: 0 })}
                    onKeyDown={(event) => event.key === 'Enter' && cover && setViewer({ id: item.id, albumIndex: coverAlbumIndex, index: 0 })}
                    role={cover ? 'button' : undefined}
                    tabIndex={cover ? 0 : undefined}
                    aria-label={cover ? `打开${item.title}分类画册` : undefined}
                  >
                    {cover ? <img className="album-cover" src={cover} alt={`${item.title}作品封面`} /> : <strong className="album-number">{String(index + 1).padStart(2, '0')}</strong>}
                    {cover && <span className="open-hint">查看模特分类</span>}
                  </div>
                  <div className="makeup-card-copy">
                    <p>{item.subtitle}</p><h3>{item.title}</h3><span>{item.copy}</span>
                    {totalImages > 0 && <small>{albums.length} 组模特 · {totalImages} 张作品</small>}
                  </div>
                </article>
              );
            })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="strength-section page-width" id="strengths" data-reveal>
        <div className="section-kicker"><span>03</span> Practice</div>
        <div className="section-head tight">
          <div><p className="overline">Strengths</p><ScrollFloat {...scrollFloatProps}>个人优势</ScrollFloat></div>
          <p>从判断风格到落地拍摄，我会先理解人物，再处理妆面：既突出五官优势，也兼顾服装、光线和镜头距离，让造型完整、耐看、可执行。</p>
        </div>
        <div className="strength-grid">
          {strengths.map((item) => <article key={item.title}><span /><h3>{item.title}</h3><p>{item.text}</p></article>)}
        </div>
      </section>

      <section className="contact-finale" id="contact" data-reveal>
        <div className="page-width finale-inner">
          <div className="finale-topline"><span>04 / Contact</span><span>Based in Hangzhou</span></div>
          <p className="overline">Available for selected projects</p>
          <ScrollFloat {...scrollFloatProps}>choose me,一起完成下一组作品</ScrollFloat>
          <p>可沟通个人写真、日常约妆、活动造型、新娘跟妆及摄影棚拍妆造。请提前说明拍摄场景、服装风格、期望妆感和时间安排。</p>
          <div className="final-actions">
            <a className="primary-btn light" href={`tel:${profile.phone}`}>电话联系 {profile.phone}</a>
            <a className="ghost-btn light" href={`sms:${profile.phone}`}>发送短信</a>
          </div>
          <footer><span>{profile.name} · Makeup Artist</span><span>{profile.city} · {years}</span></footer>
        </div>
      </section>

      {viewerItem && viewerAlbum && viewerImages.length > 0 && (
        <div className="portfolio-viewer" role="dialog" aria-modal="true" aria-label={`${viewerItem.title}作品画册`}>
          <div className="viewer-header">
            <div className="viewer-topbar">
              <div><span>{viewerItem.subtitle}</span><strong>{viewerItem.title}</strong></div>
              <div><span>{String(viewerIndex + 1).padStart(2, '0')} / {String(viewerImages.length).padStart(2, '0')}</span><button type="button" onClick={() => setViewer(null)} aria-label="关闭画册">×</button></div>
            </div>
            <div className="viewer-album-tabs" aria-label="模特分类">
              {viewerAlbums.map((album, albumIndex) => (
                <button
                  type="button"
                  key={album.id}
                  className={albumIndex === viewerAlbumIndex ? 'active' : ''}
                  onClick={() => setViewer({ id: viewerItem.id, albumIndex, index: 0 })}
                >
                  {viewerItem.title}-{album.id}
                </button>
              ))}
            </div>
          </div>
          <div className="viewer-stage" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}>
            <div className="viewer-track" style={{ transform: `translate3d(-${viewerIndex * 100}%, 0, 0)` }}>
              {viewerImages.map((image, imageIndex) => <figure key={`${viewerItem.id}-viewer-${imageIndex}`}><img src={image} alt={`${viewerItem.title}作品 ${imageIndex + 1}`} /></figure>)}
            </div>
          </div>
          {viewerImages.length > 1 && (
            <div className="viewer-controls">
              <button type="button" onClick={() => shiftViewer(-1)} aria-label="上一张">‹</button>
              <div>{viewerImages.map((_, index) => <button key={index} type="button" className={index === viewerIndex ? 'active' : ''} onClick={() => setViewer({ id: viewerItem.id, albumIndex: viewerAlbumIndex, index })} aria-label={`查看第 ${index + 1} 张`} />)}</div>
              <button type="button" onClick={() => shiftViewer(1)} aria-label="下一张">›</button>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

export default App;
