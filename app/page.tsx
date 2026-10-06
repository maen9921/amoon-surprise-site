
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const timeline = [
  {
    date: "27-12-2020",
    title: "أول مرة تعرفنا على بعض",
    text: "من هون بدأت أجمل قصة بحياتي… قصة ما كنت أتوقع إنها تصير كل هالقدر قريبة من قلبي ❤️",
  },
  {
    date: "24-05-2021",
    title: "خطبنا",
    text: "ومن يومها صار الحلم أوضح… وصار في وعد بين قلبين إنهم يكملوا المشوار سوا.",
  },
  {
    date: "15-09-2022",
    title: "تزوجنا",
    text: "اليوم اللي صرنا فيه لبعض رسميًا، واليوم اللي حسّيت فيه إني فعلًا حققت انجاز ❤️",
  },
  {
    date: "10-02-2025",
    title: "إجت بنتنا زنزون",
    text: "وكبرت فرحتنا… وصارت حياتنا أحلى وأدفى بوجودها 👼❤️",
  },
  {
    date: "Soon",
    title: "والفرح الجاي أجمل",
    text: "ولسه قصتنا الحلوة فيها فرح كثير جاي بإذن الله 👼❤️",
  },
];

const memories = [
  { src: "/images/hero-thailand.jpg", alt: "ذكريات تايلاند" },
  { src: "/images/thailand-sea.jpg", alt: "ذكريات البحر" },
  { src: "/images/thailand-statue.jpg", alt: "صورة سفر" },
  { src: "/images/thailand-tuktuk.jpg", alt: "تكتك تايلاند" },
  { src: "/images/thailand-tiger.jpg", alt: "صورة النمر" },
  { src: "/images/thailand-low-angle.jpg", alt: "صورة مرحة" },
];

function FadeIn({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.18 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`fade ${visible ? "visible" : ""} ${className}`}>
      {children}
    </div>
  );
}

export default function Home() {
  const [chapter, setChapter] = useState(0);
  const [timelineIndex, setTimelineIndex] = useState(0);
  const [quizMessage, setQuizMessage] = useState("");
  const [quizDone, setQuizDone] = useState(false);

  const [accepted, setAccepted] = useState(false);
  const [noMoves, setNoMoves] = useState(0);
  const [musicOn, setMusicOn] = useState(false);
  const [musicError, setMusicError] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);
  const chapterRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [photoIndex, setPhotoIndex] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    chapterRef.current?.querySelector<HTMLElement>("section")?.focus({ preventScroll: true });
  }, [chapter]);

  useEffect(() => {
    if (!quizDone || chapter !== 1) return;
    const timer = window.setTimeout(() => setChapter(2), 900);
    return () => window.clearTimeout(timer);
  }, [quizDone, chapter]);

  const restart = () => {
    setQuizMessage(""); setQuizDone(false); setTimelineIndex(0);
    setAccepted(false); setNoMoves(0); setPhotoIndex(null); setChapter(0);
  };

  useEffect(() => {
    if (photoIndex === null) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => { dialog.close(); document.body.style.overflow = previousOverflow; };
  }, [photoIndex !== null]);

  const begin = async () => {
    setChapter(1);
    setMusicError("");
    try {
      if (audioRef.current) {
        await audioRef.current.play();
        setMusicOn(true);
      }
    } catch {
      setMusicError("اضغطي زر الموسيقى للمحاولة مرة ثانية ♪");
    }
  };

  const toggleMusic = async () => {
    if (!audioRef.current) return;
    setMusicError("");
    if (!audioRef.current.paused) {
      audioRef.current.pause();
      setMusicOn(false);
    } else {
      try {
        await audioRef.current.play();
        setMusicOn(true);
      } catch {
        setMusicError("تعذّر تشغيل الموسيقى. اضغطي للمحاولة مرة ثانية ♪");
      }
    }
  };

  const wrongAnswer = () => {
    setQuizDone(false);
    setQuizMessage("ممم… لا 😂 حاولي مرة ثانية");
  };

  const rightAnswer = () => {
    setQuizMessage("بالزبط… هي الإجابة الصح ❤️");
    setQuizDone(true);
  };

  const accept = () => {
    setAccepted(true);
    setChapter(11);
  };

  const escapeNo = () => {
    setNoMoves((n) => Math.min(n + 1, 5));
  };


  return (
    <main className="chapterJourney" ref={chapterRef}>
      <div className="readingProgress" style={{ transform: `scaleX(${chapter / 11})` }} aria-hidden="true" />
      {chapter === 0 && <header className="siteHeader">
        <span className="monogram">A<span>♡</span>M</span>
        <span className="headerNote">حكاية إلنا، وبس.</span>
      </header>}
      <audio ref={audioRef} loop preload="none"
        onPlaying={() => { setMusicOn(true); setMusicError(""); }}
        onPause={() => setMusicOn(false)}
        onError={() => { setMusicOn(false); setMusicError("تعذّر تحميل الموسيقى. حاولي تحديث الصفحة ♪"); }}
      >
        <source src="/music/02.We_Maloh.mp3" type="audio/mpeg" />
      </audio>

      <button className="musicButton" onClick={toggleMusic} aria-label={musicOn ? "إيقاف الموسيقى" : "تشغيل الموسيقى"} aria-pressed={musicOn}>
        <span className={`soundBars ${musicOn ? "playing" : ""}`} aria-hidden="true"><i /><i /><i /><i /></span>
        <span className="soundLabel">{musicOn ? "موسيقتنا" : "الموسيقى"}</span>
      </button>

      {musicError && <p className="musicStatus" role="status">{musicError}</p>}

      {chapter === 0 && (
      <section key="chapter-0" tabIndex={-1} id="home" className="hero">
        <div className="heroVisual">
        <Image
          src="/images/hero-thailand.jpg"
          alt="Amoon"
          fill
          priority
          sizes="100vw"
          className="heroImage"
        />
        <div className="heroOverlay" />
          <span className="photoNote" dir="ltr">THAILAND · OUR FAVORITE MEMORY</span>
        </div>
        <div className="heroGlow" aria-hidden="true" />

        <div className="heroContent">
          <p className="eyebrow" dir="ltr">A LOVE LETTER, JUST FOR YOU</p>
          <h1 dir="ltr">Amoon<span className="titleHeart" aria-label="حب">♡</span></h1>
          <div className="heroRule" aria-hidden="true"><span />✦<span /></div>
          <p className="heroText">
            عندي إشي صغير إلك…
            <br />
            مش رسالة عادية،
            <br />
            ومش مفاجأة بسيطة…
            <br />
            هاي قصة صغيرة من هو بلشت الحكاية ❤️
          </p>
          <button className="primaryButton" onClick={begin}>نبدأ الرحلة ❤️</button>
          <span className="heroFootnote">من أول لقاء… ولسه الحكاية بأولها</span>
        </div>
        <div className="scrollCue" aria-hidden="true"><span>حكايتنا، خطوة بخطوة</span><span>♡</span></div>
      </section>
      )}

      {chapter === 1 && (
      <section key="chapter-1" tabIndex={-1} id="intro" className="section darkSection">
        <FadeIn className="center">
          <p className="eyebrow">قبل ما نكمل…</p>
          <h2>في سؤال صغير 😌</h2>
          <p className="lead">بتعرفي شو أحلى قرار عملتوا بحياتي؟</p>

          <div className="quizGrid">
            <button onClick={wrongAnswer} disabled={quizDone}>أتعلم البرمجة 👨‍💻</button>
            <button onClick={wrongAnswer} disabled={quizDone}>أسافر تايلاند ✈️</button>
            <button onClick={rightAnswer} disabled={quizDone}>إني عرفتك إنتِ ❤️</button>
          </div>

          {quizMessage && <p role="status" className={`quizMessage ${quizDone ? "success" : ""}`}>{quizMessage}</p>}
        </FadeIn>
      </section>
      )}

      {chapter === 2 && (
      <section key="chapter-2" tabIndex={-1} id="story" className="section storySection">
        <FadeIn className="center">
          <p className="eyebrow">Our Story</p>
          <h2>قصتنا ❤️</h2>
          <p className="sectionCopy">من أول لقاء… لبيت، وعيلة، وذكريات لسه عم تكبر معنا.</p>
        </FadeIn>

        <div className="timeline" aria-live="polite" aria-atomic="true">
          {timeline.slice(timelineIndex, timelineIndex + 1).map((item) => (
            <FadeIn key={item.date} className="timelineItem">
              <div className="timelineDot" aria-hidden="true">{String(timelineIndex + 1).padStart(2, "0")}</div>
              <div className="timelineCard">
                <span><bdi dir="ltr">{item.date}</bdi></span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      
        <div className="chapterActions timelineActions">
          <p className="chapterCount">المحطة <bdi>{timelineIndex + 1} / {timeline.length}</bdi></p>
          <div className="timelineSteps" aria-hidden="true">{timeline.map((item, i) => <span key={item.date} className={i <= timelineIndex ? "visited" : ""} />)}</div>
          <div className="timelineButtons">
            <button className="ghostButton" disabled={timelineIndex === 0} onClick={() => setTimelineIndex((i) => Math.max(0, i - 1))}>المحطة السابقة</button>
            {timelineIndex < timeline.length - 1
              ? <button className="primaryButton" onClick={() => setTimelineIndex((i) => Math.min(timeline.length - 1, i + 1))}>وبعدها؟ ←</button>
              : <button className="primaryButton" onClick={() => setChapter(3)}>نكمل الحكاية ←</button>}
          </div>
        </div>
      </section>
      )}

      {chapter === 3 && (
      <section key="chapter-3" tabIndex={-1} id="memories" className="section memoriesSection">
        <FadeIn className="center">
          <p className="eyebrow">Our Memories</p>
          <h2>ذكرياتنا الحلوة</h2>
          <p className="sectionCopy">
            معك كل لحظة إلها طعم مختلف… كل صورة إلها قصة، وكل قصة إلها مكان خاص بقلبي ❤️
          </p>
        </FadeIn>

        <div className="memoryGrid">
          {memories.map((image, i) => (
            <FadeIn key={image.src} className={`memoryCard memory${i + 1}`}>
              <button className="memoryOpen" onClick={() => setPhotoIndex(i)} aria-label={`تكبير الصورة: ${image.alt}`}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="memoryImage"
              />
              <span className="memoryCaption"><span>{image.alt}</span><span dir="ltr">0{i + 1} ↗</span></span>
              </button>
            </FadeIn>
          ))}
        </div>
      
        <div className="chapterActions"><button className="primaryButton" onClick={() => setChapter(4)}>نكمل الحكاية ←</button></div>
      </section>
      )}

      {chapter === 4 && (
      <section key="chapter-4" tabIndex={-1} className="section thailandSection">
        <div className="split">
          <FadeIn className="textPanel">
            <p className="eyebrow">Favorite Memory</p>
            <h2>سفرة تايلاند 😍</h2>
            <p>
              إذا بدي أختار ذكرى من أجمل ذكرياتنا… أكيد رح أختار سفرة تايلاند ❤️
            </p>
            <p>
              كانت مليانة ضحك، راحة، مغامرات وصور حلوة… ومهما سافرنا وشُفنا أماكن،
              رح تضل هديك السفرة من أحلى الذكريات اللي جمعتنا.
            </p>
          </FadeIn>

          <FadeIn className="featurePhoto">
            <Image
              src="/images/thailand-sea.jpg"
              alt="Thailand memory"
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              className="cover"
            />
          </FadeIn>
        </div>
      
        <div className="chapterActions"><button className="primaryButton" onClick={() => setChapter(5)}>نكمل الحكاية ←</button></div>
      </section>
      )}

      {chapter === 5 && (
      <section key="chapter-5" tabIndex={-1} className="section loveSection">
        <FadeIn className="center">
          <p className="eyebrow">What I Love About You</p>
          <h2>فيكي أشياء كثير بحبها…</h2>
        </FadeIn>

        <div className="cards3">
          <FadeIn className="softCard">
            <div className="bigEmoji">❤️</div>
            <h3>بحب حنيتك</h3>
            <p>لأنك مصدر دفا وراحة… وحنيتك بتوصلني حتى من أصغر التفاصيل.</p>
          </FadeIn>

          <FadeIn className="softCard">
            <div className="bigEmoji">😂</div>
            <h3>أكثر إشي بضحكني</h3>
            <p>
              صراحتك… خصوصًا الصراحة اللي خربت علاقتك مع ناس 😂 بس هي كمان من الأشياء
              اللي بتخليك حقيقية وواضحة.
            </p>
          </FadeIn>

          <FadeIn className="softCard">
            <div className="bigEmoji">🙏</div>
            <h3>وبدي أشكرك</h3>
            <p>على وقفتك معي بكل الظروف، وعلى اهتمامك بعيلتنا، وعلى إنك دايمًا سند حقيقي إلي ❤️</p>
          </FadeIn>
        </div>
      
        <div className="chapterActions"><button className="primaryButton" onClick={() => setChapter(6)}>نكمل الحكاية ←</button></div>
      </section>
      )}

      {chapter === 6 && (
      <section key="chapter-6" tabIndex={-1} className="section funSection">
        <div className="split reverseMobile">
          <FadeIn className="featurePhoto portrait">
            <Image
              src="/images/fun-winter.jpg"
              alt="Fun memory"
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              className="cover"
            />
          </FadeIn>

          <FadeIn className="textPanel">
            <p className="eyebrow">Us in Real Life</p>
            <h2>الحياة معنا مش رومانسية وبس 😂</h2>
            <div className="conversationCard">
              <span>السؤال الرسمي اليومي:</span>
              <strong>شو بدنا نتغدا اليوم؟ 😂</strong>
            </div>
            <p>
              بين "إنت اختار" و"لا إنت اختار"… وبين كل التفاصيل الصغيرة والضحك والأيام العادية،
              إنتِ أجمل اختيار وأحلى نصيب ❤️
            </p>
          </FadeIn>
        </div>
      
        <div className="chapterActions"><button className="primaryButton" onClick={() => setChapter(7)}>نكمل الحكاية ←</button></div>
      </section>
      )}

      {chapter === 7 && (
      <section key="chapter-7" tabIndex={-1} className="section familySection">
        <div className="split">
          <FadeIn className="textPanel">
            <p className="eyebrow">Our Little World</p>
            <h2>عيلتنا الصغيرة ❤️</h2>
            <p>
              إنتِ مش بس زوجتي… إنتِ شريكتي وصاحبة قلبي وأم زنزون ❤️
            </p>
            <p>
              وجودك بحياتي عمل فرق كبير، ووجودك بعيلتنا خلاها أدفى وأجمل.
            </p>
            <p className="soon">ولسه فروحتي الجاية أجمل Soon 👼</p>
          </FadeIn>

          <FadeIn className="featurePhoto familyPhoto">
            <Image
              src="/images/family.jpg"
              alt="Our family"
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              className="cover"
            />
          </FadeIn>
        </div>
      
        <div className="chapterActions"><button className="primaryButton" onClick={() => setChapter(8)}>نكمل الحكاية ←</button></div>
      </section>
      )}

      {chapter === 8 && (
      <section key="chapter-8" tabIndex={-1} className="section suspenseSection">
        <FadeIn className="center narrow">
          <p className="smallPause">بس…</p>
          <h2>أنا ما عملت كل هالموقع بس عشان أحكيلك إني بحبك 😌</h2>
          <p className="lead">في سبب ثاني…</p>
          <button className="primaryButton" onClick={() => setChapter(9)}>
            شو السبب؟ 👀
          </button>
        </FadeIn>

      </section>
      )}

      {chapter === 9 && (
      <section key="chapter-9" tabIndex={-1} id="letter" className="section suspenseSection letterSection">
          <div id="love-letter"><FadeIn className="mailCard">
            <div className="waxSeal" aria-hidden="true">A</div>
            <div className="mailHeader">
              <span>To: Amoon❤️</span>
              <span>From: Your husband ❤️</span>
              <span>Subject: Official Invitation</span>
            </div>
            <div className="mailBody">
              <p>مرحبًا يا أجمل أمون ❤️</p>
              <p>
                بعد مراجعة كل الذكريات والتفكير بكل اللحظات الحلوة اللي عشناها سوا…
                تقرر رسميًا تقديم دعوة خاصة جدًا لشخص مميز جدًا 😌
              </p>
              <button
                className="primaryButton"
                onClick={() => setChapter(10)}
              >
                عرض تفاصيل الدعوة
              </button>
            </div>
          </FadeIn></div>
      </section>
      )}

      {chapter === 10 && (
      <section key="chapter-10" tabIndex={-1} id="invite" className="section inviteSection">
        <FadeIn className="inviteCard">
          <div className="inviteOrnament" aria-hidden="true">✦</div>
          <p className="eyebrow" dir="ltr">YOU, ME & A LITTLE SURPRISE</p>
          <h2>عزومة عشاء ❤️</h2>

          <div className="inviteRows">
            <div><span>📅</span><p><small>التاريخ</small><strong><bdi dir="ltr">09-10-2026</bdi></strong></p></div>
            <div><span>🕚</span><p><small>الوقت</small><strong><bdi dir="ltr">11:00 PM</bdi></strong></p></div>
            <div><span>📍</span><p><small>المكان</small><strong><bdi dir="ltr">Surprise 🤫</bdi></strong></p></div>
            <div><span>👗</span><p><small>المود</small><strong>جهزي حالك وخلي الباقي عليّ 😌❤️</strong></p></div>
          </div>

          <p className="attendance">الحضور إجباري… والاعتذار غير مقبول 😎</p>

          <div className="finalQuestion">
            <p>وبقي أهم سؤال…</p>
            <h3>بتوافقي تطلعي معي على عزومة عشاء؟ ❤️</h3>
          </div>

          <div className="answerArea">
            <button className="yesButton" onClick={accept}>أكيد ❤️</button>
            {!accepted && noMoves < 5 && (
              <button
                className={`noButton noPosition${noMoves}`}
                onPointerEnter={(e) => {
                  if (e.pointerType === "mouse") escapeNo();
                }}
                onClick={escapeNo}
              >
                لا 🙈
              </button>
            )}
          </div>

          {noMoves >= 3 && !accepted && (
            <p className="systemMessage">
              شكلك مش فاهمة النظام 😂 الموقع مبرمج يقبل جواب واحد فقط ❤️
            </p>
          )}
        </FadeIn>
      </section>
      )}


        {chapter === 11 && (
      <section key="chapter-11" tabIndex={-1} id="finale" className="section finale">
          <div className="confetti" aria-hidden="true">
            {Array.from({ length: 34 }).map((_, i) => (
              <i key={i} style={{
                left: `${(i * 37) % 100}%`,
                background: ["#c8a77a", "#e4cdb0", "#8e4553", "#f4eee4"][i % 4],
                animationDuration: `${3.5 + (i % 5) * 0.55}s`,
                animationDelay: `${(i % 7) * -0.45}s`,
              }} />
            ))}
          </div>

          <Image
            src="/images/couple-closeup.jpg"
            alt="Amoon and Maen"
            fill
            sizes="100vw"
            className="finaleImage"
          />
          <div className="finaleOverlay" />

          <FadeIn className="finaleContent">
            <div className="check">✓</div>
            <p className="eyebrow">Invitation Accepted</p>
            <h2>تم قبول الدعوة بنجاح ❤️</h2>
            <p>كنت عارف إنك رح توافقي 😌</p>
            <h3>I Love You Amoon❤️</h3>
            <p>موعدنا قريب… جهزي حالك يا أجمل مفاجأة بحياتي ❤️</p>

            <button
              className="ghostButton"
              onClick={restart}
            >
              أعيدي القصة من البداية ↑
            </button>
          </FadeIn>
        </section>
      )}

      {chapter === 11 && <footer><span className="footerSignature" dir="ltr">Always, you.</span><span>Made with ❤️ for Amoon</span></footer>}
      <dialog ref={dialogRef} className="photoDialog" onClose={() => setPhotoIndex(null)} onClick={(e) => { if (e.target === e.currentTarget) setPhotoIndex(null); }} onKeyDown={(e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault();
          setPhotoIndex((i) => i === null ? null : (i + (e.key === "ArrowLeft" ? 1 : memories.length - 1)) % memories.length);
        }
      }} aria-label="ألبوم ذكرياتنا">
        <button className="dialogClose" onClick={() => setPhotoIndex(null)} aria-label="إغلاق الصورة">×</button>
        {photoIndex !== null && <>
          <div className="dialogImage"><Image src={memories[photoIndex].src} alt={memories[photoIndex].alt} fill sizes="90vw" className="contain" /></div>
          <div className="dialogControls">
            <button onClick={() => setPhotoIndex((photoIndex + memories.length - 1) % memories.length)} aria-label="الصورة السابقة">→</button>
            <p>{memories[photoIndex].alt}<span dir="ltr">{photoIndex + 1} / {memories.length}</span></p>
            <button onClick={() => setPhotoIndex((photoIndex + 1) % memories.length)} aria-label="الصورة التالية">←</button>
          </div>
        </>}
      </dialog>
    </main>
  );
}
