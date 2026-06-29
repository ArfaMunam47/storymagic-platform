import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Sparkles,
  Wand2,
  Mic,
  Globe2,
  BookOpen,
  Moon,
  GraduationCap,
  Brain,
  Star,
  Heart,
  Play,
  ArrowRight,
  Check,
  ChevronDown,
  Cloud,
  Rocket,
  Users,
  Trophy,
  Palette,
  Shield,
} from "lucide-react";
import heroCharacter from "@/assets/hero-character.png";
import storybook from "@/assets/storybook.png";
import dragon from "@/assets/dragon.png";
import worldSpace from "@/assets/world-space.png";
import worldFantasy from "@/assets/world-fantasy.png";
import worldOcean from "@/assets/world-ocean.png";
import worldDino from "@/assets/world-dino.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "StoryMagic — AI Bedtime Stories Where Your Child Is the Hero" },
      {
        name: "description",
        content:
          "Personalized AI-powered storybooks for kids. Pick a world, build a hero, and unlock magical bedtime adventures loved by 10,000+ families.",
      },
      { property: "og:title", content: "StoryMagic — AI Stories for Curious Kids" },
      {
        property: "og:description",
        content: "Magical, personalized AI adventures where your child is the hero of every story.",
      },
    ],
  }),
  component: Landing,
});

function Sparkle({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  return (
    <span
      className={`pointer-events-none absolute block animate-twinkle ${className}`}
      style={{ animationDelay: `${delay}s` }}
      aria-hidden
    >
      <Sparkles className="size-full text-magic-yellow drop-shadow" />
    </span>
  );
}

function FloatingCloud({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute opacity-80 ${className}`} aria-hidden>
      <Cloud className="size-full text-white drop-shadow-[0_8px_24px_rgba(180,160,255,0.4)]" />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50">
      <div className="mx-auto mt-4 flex max-w-6xl items-center justify-between rounded-full glass px-5 py-3 shadow-soft">
        <a href="#" className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-2xl bg-gradient-primary text-white shadow-soft">
            <Wand2 className="size-5" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight">StoryMagic</span>
        </a>
        <nav className="hidden items-center gap-7 text-sm font-semibold text-muted-foreground md:flex">
          <a href="#features" className="transition hover:text-foreground">Features</a>
          <a href="#worlds" className="transition hover:text-foreground">Worlds</a>
          <a href="#pricing" className="transition hover:text-foreground">Pricing</a>
          <a href="#faq" className="transition hover:text-foreground">FAQ</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/auth/signin"
            className="hidden rounded-full px-4 py-2 text-sm font-semibold text-foreground/80 hover:text-foreground sm:inline-block"
          >
            Sign in
          </Link>
          <Link
            to="/auth/signup"
            className="rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-glow"
          >
            Start free
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handle = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) / r.width;
      const y = (e.clientY - r.top - r.height / 2) / r.height;
      setPos({ x, y });
    };
    el.addEventListener("mousemove", handle);
    return () => el.removeEventListener("mousemove", handle);
  }, []);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-gradient-hero pb-32 pt-10"
    >
      {/* Floating decor */}
      <FloatingCloud className="left-[6%] top-24 size-24 animate-drift" />
      <FloatingCloud className="right-[10%] top-16 size-32 animate-float-y" />
      <FloatingCloud className="left-1/3 top-48 size-16 opacity-60 animate-drift" />
      <Sparkle className="left-[8%] top-[40%] size-6" delay={0.2} />
      <Sparkle className="right-[14%] top-[55%] size-8" delay={1.1} />
      <Sparkle className="left-1/2 top-[18%] size-5" delay={0.6} />

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 pt-12 lg:grid-cols-2 lg:gap-6 lg:pt-20">
        <div className="relative z-10 animate-pop-in">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-magic-purple shadow-soft backdrop-blur">
            <Sparkles className="size-3.5" /> New • AI storyteller for kids
          </span>
          <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] text-foreground sm:text-6xl lg:text-7xl">
            Magical stories that{" "}
            <span className="text-gradient-magic">spark every child's</span> imagination.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground sm:text-xl">
            Personalized AI-powered adventures where your child becomes the hero — narrated,
            illustrated, and ready in seconds.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/auth/signup"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-primary px-7 py-4 text-base font-bold text-white shadow-glow transition hover:-translate-y-1"
            >
              Start free
              <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </Link>
            <a
              href="#worlds"
              className="inline-flex items-center gap-2 rounded-full bg-white/80 px-6 py-4 text-base font-bold text-foreground shadow-soft backdrop-blur transition hover:-translate-y-1 hover:bg-white"
            >
              <Play className="size-4 fill-current" /> Watch demo
            </a>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-3">
              {["bg-magic-pink", "bg-magic-sky", "bg-magic-mint", "bg-magic-orange"].map((c) => (
                <div
                  key={c}
                  className={`size-10 rounded-full border-4 border-white ${c} shadow-soft`}
                />
              ))}
            </div>
            <div>
              <div className="flex text-magic-orange">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <p className="text-sm font-semibold text-muted-foreground">
                Loved by 10,000+ parents
              </p>
            </div>
          </div>
        </div>

        {/* Hero illustration */}
        <div className="relative">
          <div
            className="relative mx-auto aspect-square w-full max-w-[560px]"
            style={{
              transform: `translate3d(${pos.x * 18}px, ${pos.y * 18}px, 0)`,
              transition: "transform 200ms ease-out",
            }}
          >
            {/* glow halo */}
            <div className="absolute inset-8 rounded-full bg-gradient-magic opacity-30 blur-3xl animate-float-y" />
            <img
              src={heroCharacter}
              alt="Child hero holding a magical storybook with dragons and sparkles"
              width={1280}
              height={1280}
              className="relative z-10 size-full object-contain drop-shadow-[0_30px_60px_rgba(120,80,200,0.35)]"
            />

            {/* Floating chips */}
            <div className="absolute -left-4 top-10 z-20 hidden rounded-2xl bg-white/90 px-4 py-3 shadow-float backdrop-blur animate-float-slow sm:flex sm:items-center sm:gap-3">
              <span className="grid size-9 place-items-center rounded-xl bg-magic-yellow/30 text-2xl">⭐</span>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Stories created</p>
                <p className="font-display text-lg font-bold">50,000+</p>
              </div>
            </div>
            <div
              className="absolute -right-4 top-1/3 z-20 hidden rounded-2xl bg-white/90 px-4 py-3 shadow-float backdrop-blur animate-float-y sm:flex sm:items-center sm:gap-3"
              style={{ animationDelay: "1.2s" }}
            >
              <span className="grid size-9 place-items-center rounded-xl bg-magic-pink/25 text-2xl">❤️</span>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Parent rating</p>
                <p className="font-display text-lg font-bold">4.9 / 5</p>
              </div>
            </div>
            <div
              className="absolute bottom-4 left-6 z-20 hidden rounded-2xl bg-white/90 px-4 py-3 shadow-float backdrop-blur animate-float-slow sm:flex sm:items-center sm:gap-3"
              style={{ animationDelay: "0.6s" }}
            >
              <span className="grid size-9 place-items-center rounded-xl bg-magic-sky/25 text-2xl">🌎</span>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Countries</p>
                <p className="font-display text-lg font-bold">120+</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <svg
        viewBox="0 0 1440 120"
        className="absolute bottom-0 left-0 w-full"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M0,64 C240,128 480,0 720,32 C960,64 1200,128 1440,80 L1440,120 L0,120 Z"
          fill="oklch(0.99 0.01 320)"
        />
      </svg>
    </section>
  );
}

function TrustedBy() {
  const logos = ["Parent Co.", "KidsRead", "TinyTales", "Playful", "Lumina", "MomDigest"];
  return (
    <section className="bg-background py-10">
      <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
        Trusted by parents featured in
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {logos.map((l) => (
          <span
            key={l}
            className="font-display text-xl font-semibold text-foreground/40 transition hover:text-foreground"
          >
            {l}
          </span>
        ))}
      </div>
    </section>
  );
}

const features = [
  { icon: Sparkles, title: "AI-generated stories", desc: "Fresh tales in seconds, tuned to your child's age and interests.", tint: "bg-magic-purple/10 text-magic-purple" },
  { icon: Palette, title: "Personalized heroes", desc: "Pick hair, skin, outfit, pets and superpowers in one tap.", tint: "bg-magic-pink/15 text-magic-pink" },
  { icon: Mic, title: "Voice narration", desc: "Cozy, expressive narration in your favorite reading voice.", tint: "bg-magic-sky/20 text-magic-sky" },
  { icon: Globe2, title: "30+ languages", desc: "Help kids grow bilingual with a tap. Stories in any tongue.", tint: "bg-magic-mint/20 text-magic-mint" },
  { icon: BookOpen, title: "Reading progress", desc: "Track minutes read, words learned and weekly streaks.", tint: "bg-magic-orange/15 text-magic-orange" },
  { icon: Moon, title: "Bedtime mode", desc: "Warm tones, slow pacing and a gentle sleep timer.", tint: "bg-magic-purple/10 text-magic-purple" },
  { icon: GraduationCap, title: "Educational quests", desc: "Math, kindness and curiosity woven into every story.", tint: "bg-magic-sky/20 text-magic-sky" },
  { icon: Brain, title: "Learning games", desc: "Mini quizzes and rhymes keep little minds curious.", tint: "bg-magic-mint/20 text-magic-mint" },
];

function Features() {
  return (
    <section id="features" className="relative bg-background py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-magic-purple/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-magic-purple">
            Features
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
            Everything magical, <span className="text-gradient-magic">none of the noise.</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A complete storytelling studio for curious kids and the parents who love them.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group relative rounded-3xl bg-card p-6 shadow-card transition hover:-translate-y-2 hover:shadow-float"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className={`inline-grid size-12 place-items-center rounded-2xl ${f.tint}`}>
                <f.icon className="size-6" />
              </div>
              <h3 className="mt-5 font-display text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StoryDemo() {
  return (
    <section className="relative overflow-hidden bg-gradient-sky py-24">
      <FloatingCloud className="right-10 top-10 size-24 animate-drift" />
      <Sparkle className="left-12 top-1/3 size-6" />
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-bold uppercase tracking-wider text-magic-pink backdrop-blur">
            Story player
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
            Watch a tale unfold,{" "}
            <span className="text-gradient-magic">one magical page at a time.</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Pick a world, tap a hero, and we'll generate an illustrated story with cozy narration,
            page turns and tiny surprises along the way.
          </p>
          <ul className="mt-6 space-y-3 text-sm font-semibold">
            {["Animated page flips", "Mouse-following sparkles", "Auto-saved bedtime library"].map((x) => (
              <li key={x} className="flex items-center gap-3">
                <span className="grid size-6 place-items-center rounded-full bg-magic-mint/40 text-magic-mint">
                  <Check className="size-3.5" />
                </span>
                {x}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="relative rounded-[2.5rem] bg-white p-5 shadow-float">
            <div className="rounded-[1.75rem] bg-gradient-hero p-6">
              <div className="flex items-center justify-between text-xs font-bold text-foreground/70">
                <span>Chapter 3 · The Glowing Forest</span>
                <span>2 of 8</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="aspect-[3/4] rounded-2xl bg-white/80 p-4 shadow-soft">
                  <img src={storybook} alt="Magical glowing storybook" width={400} height={520} loading="lazy" className="size-full object-contain" />
                </div>
                <div className="aspect-[3/4] rounded-2xl bg-white/90 p-5 shadow-soft">
                  <p className="font-display text-sm font-bold text-magic-purple">Page two</p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground">
                    Mira tiptoed past the sleeping mushrooms. A tiny dragon blinked at her from
                    a glowing leaf and whispered, <em>"follow me."</em>
                  </p>
                  <div className="mt-4 flex gap-2">
                    {[1, 2, 3].map((d) => (
                      <span key={d} className={`h-1.5 flex-1 rounded-full ${d === 2 ? "bg-magic-pink" : "bg-foreground/15"}`} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between rounded-2xl bg-white/90 px-4 py-3 shadow-soft">
                <button className="grid size-10 place-items-center rounded-full bg-gradient-primary text-white shadow-soft">
                  <Play className="size-4 fill-current" />
                </button>
                <div className="mx-4 h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/10">
                  <div className="h-full w-1/3 rounded-full bg-gradient-magic" />
                </div>
                <span className="text-xs font-bold text-muted-foreground">02:14</span>
              </div>
            </div>
          </div>

          <img
            src={dragon}
            alt=""
            width={200}
            height={200}
            loading="lazy"
            className="absolute -right-6 -top-10 size-32 animate-float-slow drop-shadow-[0_20px_30px_rgba(200,100,180,0.4)] sm:size-40"
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}

const worlds = [
  { name: "Fantasy Kingdom", img: worldFantasy, tint: "from-magic-pink/20 to-magic-purple/20" },
  { name: "Space Adventure", img: worldSpace, tint: "from-magic-sky/30 to-magic-purple/20" },
  { name: "Underwater World", img: worldOcean, tint: "from-magic-sky/40 to-magic-mint/30" },
  { name: "Dinosaur Land", img: worldDino, tint: "from-magic-mint/30 to-magic-yellow/30" },
];

function Worlds() {
  return (
    <section id="worlds" className="bg-background py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-magic-pink/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-magic-pink">
            Magical worlds
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
            Pick a world, then{" "}
            <span className="text-gradient-magic">step right in.</span>
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {worlds.map((w) => (
            <div
              key={w.name}
              className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${w.tint} p-6 shadow-card transition hover:-translate-y-2 hover:shadow-float`}
            >
              <div className="absolute -right-6 -top-6 size-24 rounded-full bg-white/40 blur-2xl" />
              <div className="relative aspect-square">
                <img
                  src={w.img}
                  alt={w.name}
                  width={400}
                  height={400}
                  loading="lazy"
                  className="size-full object-contain transition duration-700 group-hover:scale-110 group-hover:-rotate-3"
                />
              </div>
              <p className="relative mt-3 text-center font-display text-lg font-bold">{w.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Personalize() {
  const options = [
    { label: "Hair", value: "Curly" },
    { label: "Skin tone", value: "Warm" },
    { label: "Outfit", value: "Explorer" },
    { label: "Pet", value: "Mini dragon" },
    { label: "Color", value: "Sunset pink" },
    { label: "Power", value: "Talks to animals" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-mint py-24">
      <Sparkle className="left-10 top-12 size-7" />
      <Sparkle className="right-16 bottom-20 size-6" delay={0.8} />
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
        <div className="relative">
          <div className="relative mx-auto aspect-square w-full max-w-md rounded-[2.5rem] bg-white/60 p-6 shadow-float backdrop-blur">
            <div className="absolute inset-6 rounded-3xl bg-gradient-magic opacity-20 blur-2xl" />
            <img
              src={heroCharacter}
              alt="Customized child hero preview"
              width={800}
              height={800}
              loading="lazy"
              className="relative size-full object-contain animate-float-y"
            />
          </div>
        </div>
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-bold uppercase tracking-wider text-magic-mint backdrop-blur">
            Character studio
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
            Build a hero that looks{" "}
            <span className="text-gradient-magic">just like them.</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Every detail matters. Customize how your child appears in every story — outfits,
            sidekicks, even superpowers.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {options.map((o) => (
              <div key={o.label} className="rounded-2xl bg-white/90 px-4 py-3 shadow-soft">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {o.label}
                </p>
                <p className="mt-0.5 font-display text-sm font-bold text-foreground">{o.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const benefits = [
  { icon: BookOpen, title: "Reading skills", color: "bg-magic-purple/15 text-magic-purple" },
  { icon: Brain, title: "Vocabulary", color: "bg-magic-pink/15 text-magic-pink" },
  { icon: Sparkles, title: "Creativity", color: "bg-magic-orange/15 text-magic-orange" },
  { icon: Trophy, title: "Confidence", color: "bg-magic-yellow/30 text-foreground" },
  { icon: Rocket, title: "Problem solving", color: "bg-magic-sky/25 text-magic-sky" },
  { icon: Heart, title: "Empathy", color: "bg-magic-pink/15 text-magic-pink" },
  { icon: GraduationCap, title: "Critical thinking", color: "bg-magic-mint/25 text-magic-mint" },
  { icon: Shield, title: "Focus", color: "bg-magic-purple/15 text-magic-purple" },
];

function Benefits() {
  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-magic-mint/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-magic-mint">
            Learning benefits
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
            Bedtime that quietly{" "}
            <span className="text-gradient-magic">grows little minds.</span>
          </h2>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="group flex flex-col items-center gap-3 rounded-3xl bg-card p-6 text-center shadow-card transition hover:-translate-y-1 hover:shadow-float"
            >
              <span className={`grid size-14 place-items-center rounded-2xl ${b.color} transition group-hover:scale-110`}>
                <b.icon className="size-6" />
              </span>
              <p className="font-display font-bold">{b.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const testimonials = [
  { name: "Amelia R.", role: "Mom of 2", color: "from-magic-purple to-magic-pink", text: "Bedtime went from a battle to the best part of our day. My son asks for 'just one more chapter' every single night." },
  { name: "Daniel K.", role: "Dad in Berlin", color: "from-magic-sky to-magic-purple", text: "The Spanish narration is helping my daughter pick up vocabulary effortlessly. Worth every cent." },
  { name: "Priya S.", role: "Mom of 1", color: "from-magic-orange to-magic-pink", text: "She designs a new hero every week. It feels like a tiny Pixar studio living on our couch." },
  { name: "Marcus T.", role: "Dad of 3", color: "from-magic-mint to-magic-sky", text: "Three kids, three very different stories every night — and somehow each one is enchanted." },
  { name: "Yuki H.", role: "Mom in Tokyo", color: "from-magic-pink to-magic-orange", text: "My daughter is shy, but seeing herself as the brave hero changed how she sees herself in real life." },
  { name: "Sara B.", role: "Mom of 2", color: "from-magic-purple to-magic-yellow", text: "We unplug, snuggle, and explore an entire universe. It's our favorite 15 minutes of the day." },
];

function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const perPage = 3;
  const pages = Math.ceil(testimonials.length / perPage);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setPage((p) => (p + 1) % pages), 4500);
    return () => clearInterval(t);
  }, [paused, pages]);

  const visible = testimonials.slice(page * perPage, page * perPage + perPage);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-gradient-hero py-24">
      <FloatingCloud className="left-10 top-12 size-20 animate-drift" />
      <Sparkle className="right-12 top-20 size-6" />
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-bold uppercase tracking-wider text-magic-purple backdrop-blur">
            Parents love it
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
            Hear from parents who{" "}
            <span className="text-gradient-magic">love Story Magic.</span>
          </h2>
        </motion.div>

        <div
          className="relative mt-14"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="grid grid-cols-1 gap-6 md:grid-cols-3"
            >
              {visible.map((t) => (
                <motion.figure
                  key={t.name}
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="group relative overflow-hidden rounded-3xl bg-white p-7 shadow-card transition hover:shadow-float"
                >
                  <div className={`absolute -right-10 -top-10 size-32 rounded-full bg-gradient-to-br ${t.color} opacity-20 transition group-hover:scale-125`} />
                  <div className="relative flex text-magic-orange">
                    {Array.from({ length: 5 }).map((_, k) => (
                      <Star key={k} className="size-4 fill-current" />
                    ))}
                  </div>
                  <blockquote className="relative mt-5 text-base leading-relaxed text-foreground/90">
                    {t.text}
                  </blockquote>
                  <figcaption className="relative mt-6 flex items-center gap-3">
                    <span className={`grid size-11 place-items-center rounded-full bg-gradient-to-br ${t.color} font-display text-sm font-bold text-white shadow-soft`}>
                      {t.name[0]}
                    </span>
                    <div>
                      <p className="font-display font-bold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </figcaption>
                </motion.figure>
              ))}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-center gap-2">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 rounded-full transition-all ${i === page ? "w-8 bg-gradient-primary" : "w-2 bg-foreground/20 hover:bg-foreground/40"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "/month",
    blurb: "Try the magic, no card needed.",
    features: ["3 stories per month", "1 child profile", "Standard voices", "Web reader"],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Family",
    price: "$9",
    period: "/month",
    blurb: "Unlimited bedtime adventures.",
    features: ["Unlimited stories", "Up to 4 kids", "All voices & languages", "Bedtime mode", "Offline library"],
    cta: "Start 14-day trial",
    highlight: true,
  },
  {
    name: "Premium",
    price: "$19",
    period: "/month",
    blurb: "Everything, plus the extras.",
    features: ["Everything in Family", "Voice clone (your voice)", "Printed storybooks (2/mo)", "Early-access worlds"],
    cta: "Go premium",
    highlight: false,
  },
];

function Pricing() {
  return (
    <section id="pricing" className="bg-background py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-magic-orange/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-magic-orange">
            Pricing
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
            Simple, family-friendly{" "}
            <span className="text-gradient-magic">pricing.</span>
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative flex flex-col rounded-[2rem] border bg-card p-8 shadow-card transition hover:-translate-y-2 hover:shadow-float ${
                p.highlight ? "border-transparent bg-gradient-magic text-white lg:-mt-6 lg:mb-0 lg:scale-105" : "border-border"
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-magic-purple shadow-soft">
                  Most loved
                </span>
              )}
              <h3 className="font-display text-2xl font-bold">{p.name}</h3>
              <p className={`mt-1 text-sm ${p.highlight ? "text-white/85" : "text-muted-foreground"}`}>
                {p.blurb}
              </p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-5xl font-bold">{p.price}</span>
                <span className={p.highlight ? "text-white/80" : "text-muted-foreground"}>{p.period}</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <span
                      className={`grid size-5 place-items-center rounded-full ${
                        p.highlight ? "bg-white/25 text-white" : "bg-magic-mint/30 text-magic-mint"
                      }`}
                    >
                      <Check className="size-3" />
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#cta"
                className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 font-bold transition hover:-translate-y-0.5 ${
                  p.highlight
                    ? "bg-white text-magic-purple shadow-soft"
                    : "bg-gradient-primary text-white shadow-soft hover:shadow-glow"
                }`}
              >
                {p.cta} <ArrowRight className="size-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const faqs = [
  {
    q: "Is StoryMagic safe for children?",
    a: "Yes. Every story is filtered through age-appropriate safety models, reviewed prompts, and parent-controlled filters. No ads, no third-party tracking inside the kids experience.",
  },
  {
    q: "What ages is it for?",
    a: "Stories are tuned for kids ages 3–10. You can set vocabulary level, story length, and themes per child.",
  },
  {
    q: "How many languages do you support?",
    a: "Over 30 languages with native-sounding narration, including Spanish, French, German, Hindi, Mandarin, Portuguese and more.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Absolutely. Cancel in two taps — no questions asked. Your library remains available read-only.",
  },
  {
    q: "Does it work offline?",
    a: "Yes. Generated stories can be downloaded to the app for plane rides, road trips and bedtime without Wi-Fi.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="bg-background py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-magic-sky/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-magic-sky">
            Questions
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
            Things parents <span className="text-gradient-magic">often ask.</span>
          </h2>
        </div>

        <div className="mt-12 space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <button
                key={f.q}
                onClick={() => setOpen(isOpen ? null : i)}
                className="block w-full rounded-3xl bg-card p-6 text-left shadow-card transition hover:shadow-float"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-display text-lg font-bold">{f.q}</span>
                  <ChevronDown
                    className={`size-5 shrink-0 text-magic-purple transition ${isOpen ? "rotate-180" : ""}`}
                  />
                </div>
                <div
                  className={`grid overflow-hidden transition-all duration-300 ${
                    isOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <p className="overflow-hidden text-muted-foreground">{f.a}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section id="cta" className="relative overflow-hidden bg-gradient-sunset py-24 text-white">
      <Sparkle className="left-[8%] top-12 size-6" />
      <Sparkle className="right-[12%] top-24 size-8" delay={0.7} />
      <Sparkle className="left-1/3 bottom-16 size-5" delay={1.4} />
      <FloatingCloud className="right-10 top-10 size-24 opacity-50 animate-drift" />

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-4xl font-bold leading-tight sm:text-6xl">
            Ready to create your child's next adventure?
          </h2>
          <p className="mt-5 max-w-lg text-lg text-white/85">
            Start free, no credit card required. Your first magical story is just one tap away.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-bold text-magic-purple shadow-glow transition hover:-translate-y-1"
            >
              Start free <ArrowRight className="size-4" />
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/60 px-7 py-4 font-bold text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/10"
            >
              <Play className="size-4 fill-current" /> Watch demo
            </a>
          </div>
          <div className="mt-6 flex items-center gap-2 text-sm text-white/85">
            <Users className="size-4" /> Join 10,000+ families lighting up bedtime.
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-10 rounded-full bg-white/30 blur-3xl" />
          <img
            src={heroCharacter}
            alt=""
            width={1280}
            height={1280}
            loading="lazy"
            className="relative mx-auto size-full max-w-md object-contain drop-shadow-[0_30px_60px_rgba(60,30,80,0.4)] animate-float-y"
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-foreground/95 text-white">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 px-6 py-16 md:grid-cols-5">
        <div className="col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-2xl bg-gradient-primary">
              <Wand2 className="size-5" />
            </span>
            <span className="font-display text-xl font-bold">StoryMagic</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-white/70">
            Personalized AI bedtime stories where your child is the hero. Made with love by parents,
            for parents.
          </p>
        </div>
        {[
          { title: "Product", links: ["Features", "Worlds", "Pricing", "Changelog"] },
          { title: "Company", links: ["About", "Blog", "Careers", "Press"] },
          { title: "Support", links: ["Help center", "Contact", "Privacy", "Terms"] },
        ].map((col) => (
          <div key={col.title}>
            <p className="font-display text-sm font-bold uppercase tracking-wider">{col.title}</p>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              {col.links.map((l) => (
                <li key={l}>
                  <a href="#" className="transition hover:text-white">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-white/60 sm:flex-row">
          <p>© {new Date().getFullYear()} StoryMagic. Crafted with sparkles.</p>
          <p>Made for curious kids everywhere.</p>
        </div>
      </div>
    </footer>
  );
}

function Landing() {
  return (
    <main className="min-h-screen bg-background">
      <Nav />
      <Hero />
      <TrustedBy />
      <Features />
      <StoryDemo />
      <Worlds />
      <Personalize />
      <Benefits />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
