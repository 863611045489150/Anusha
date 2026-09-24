import { type ReactNode, useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: 0 | 1 | 2 | 3;
  testId?: string;
};

function Reveal({ children, className = '', delay = 0, testId }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add('is-visible');
          observer.unobserve(element);
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${delay ? `reveal-delay-${delay}` : ''} ${className}`}
      data-testid={testId}
    >
      {children}
    </div>
  );
}

function EnvelopePlaceholder({
  label,
  tilt = false,
}: {
  label: string;
  tilt?: boolean;
}) {
  return (
    <figure className={`envelope-frame ${tilt ? 'tilt-left' : ''}`} data-testid={`placeholder-envelope-${label}`}>
      <div className="envelope-art" role="img" aria-label={`Paper envelope placeholder for a future ${label} photograph`}>
        <span className="envelope-caption">photograph to come / {label}</span>
      </div>
      <figcaption className="photo-note">A place held open for a photograph</figcaption>
    </figure>
  );
}

function ChapterLabel({ number, children }: { number: string; children: ReactNode }) {
  return (
    <div className="chapter-label" data-testid={`label-chapter-${number}`}>
      <span>{number}</span>
      <span>{children}</span>
    </div>
  );
}

function ChapterRail() {
  const chapters = [
    ['01', 'Prologue', 'prologue'],
    ['02', 'Who You Are', 'who-you-are'],
    ['03', 'Our Story', 'our-story'],
    ['04', "What I've Never Said", 'never-said'],
    ['05', 'Twenty', 'twenty'],
    ['06', 'A Letter', 'a-letter'],
    ['07', 'Always', 'always'],
  ];

  return (
    <nav className="chapter-rail" aria-label="Chapters">
      <ol>
        {chapters.map(([number, label, id]) => (
          <li key={id}>
            <a className="chapter-link" href={`#${id}`} data-testid={`link-chapter-${id}`}>
              <span className="chapter-number">{number}</span>
              {label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function TributePage() {
  const [openSecret, setOpenSecret] = useState<number | null>(null);

  const scrollToChapters = () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById('who-you-are')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  const secrets = [
    'You make room for people to be more themselves.',
    'I notice the quiet ways you keep going.',
    'Knowing you has made ordinary days feel worth keeping.',
  ];

  return (
    <main className="tribute-page" data-testid="page-anusha-tribute">
      <header className="site-header">
        <a href="#prologue" className="monogram" aria-label="Return to the beginning" data-testid="link-home-monogram">
          A
        </a>
        <p className="header-note">Anusha Gupta / twenty</p>
        <button className="chapter-jump" type="button" onClick={scrollToChapters} data-testid="button-begin-reading">
          Begin reading
        </button>
      </header>

      <section className="hero" id="prologue" aria-labelledby="prologue-title">
        <div className="hero-copy">
          <Reveal testId="text-prologue-eyebrow">
            <p className="eyebrow">A small keepsake / for your twentieth year</p>
          </Reveal>
          <Reveal delay={1} testId="text-prologue-title">
            <h1 className="hero-title" id="prologue-title">
              For Anusha,<br />
              on turning <em>20</em>
            </h1>
          </Reveal>
          <div className="hero-bottom">
            <Reveal delay={2} testId="text-prologue-intro">
              <p className="hero-intro">
                A few pages for the person you are, the space you make, and the things that stay with us.
              </p>
            </Reveal>
            <Reveal delay={3} testId="text-prologue-scroll">
              <span className="scroll-mark">Scroll slowly</span>
            </Reveal>
          </div>
        </div>
        <div className="hero-envelope" data-testid="visual-prologue-envelope">
          <EnvelopePlaceholder label="the opening photograph" />
        </div>
      </section>

      <ChapterRail />

      <section className="chapter" id="who-you-are" aria-labelledby="who-you-are-title">
        <ChapterLabel number="02">Who You Are</ChapterLabel>
        <Reveal testId="heading-who-you-are">
          <h2 className="chapter-heading" id="who-you-are-title">
            You are more than the <em>sum</em> of your days.
          </h2>
        </Reveal>
        <div className="chapter-grid offset">
          <Reveal delay={1} testId="copy-who-you-are">
            <div className="body-copy dropcap">
              <p>
                There is a particular steadiness to you. Not the kind that asks to be noticed, but the kind that
                changes a room by being in it. It lives in the way you listen, in the care you take with small things,
                in the permission you give people to arrive as they are.
              </p>
              <p>
                Twenty is not a finished portrait. It is another margin, another page, another chance to keep finding
                the language that feels like yours.
              </p>
            </div>
          </Reveal>
          <Reveal delay={2} testId="visual-who-you-are">
            <EnvelopePlaceholder label="a portrait" />
          </Reveal>
        </div>
        <Reveal delay={3} testId="list-who-you-are">
          <div className="character-list">
            <div className="character-item">
              <strong>The way you notice</strong>
              <span>Some things matter because you see them.</span>
            </div>
            <div className="character-item">
              <strong>The way you stay</strong>
              <span>Presence, without needing a performance.</span>
            </div>
            <div className="character-item">
              <strong>The way you grow</strong>
              <span>Not all at once. Still, always.</span>
            </div>
            <div className="character-item">
              <strong>The way you are</strong>
              <span>Already enough to be remembered clearly.</span>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="chapter" id="our-story" aria-labelledby="our-story-title">
        <ChapterLabel number="03">Our Story</ChapterLabel>
        <Reveal testId="heading-our-story">
          <h2 className="chapter-heading" id="our-story-title">
            The details are <em>small.</em><br />
            The feeling is not.
          </h2>
        </Reveal>
        <div className="chapter-grid reverse">
          <Reveal delay={1} testId="visual-our-story">
            <EnvelopePlaceholder label="a shared moment" tilt />
          </Reveal>
          <Reveal delay={2} testId="copy-our-story">
            <div className="body-copy">
              <p>
                This is not an attempt to put everything into words. Some parts of a story are better left as they
                happened: unannounced, imperfect, and ours.
              </p>
              <p>
                What I keep is the shape of it. The ease that turns up when it is least expected. The conversations
                that outlast the reason they started. The understanding that does not need a caption.
              </p>
              <blockquote className="pull-quote">
                “Some of the best things become important quietly.”
                <cite>— a line for the margins</cite>
              </blockquote>
            </div>
          </Reveal>
        </div>
        <Reveal delay={3} testId="list-our-story">
          <div className="memory-list">
            <div className="memory-item">
              <span className="memory-index">I /</span>
              <div>
                <h3>The beginning</h3>
                <p>Before we knew which moments would become part of the story.</p>
              </div>
            </div>
            <div className="memory-item">
              <span className="memory-index">II /</span>
              <div>
                <h3>The in-between</h3>
                <p>All the ordinary time that turned out not to be ordinary at all.</p>
              </div>
            </div>
            <div className="memory-item">
              <span className="memory-index">III /</span>
              <div>
                <h3>The knowing</h3>
                <p>The point where remembering did not require trying.</p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="chapter" id="never-said" aria-labelledby="never-said-title">
        <ChapterLabel number="04">What I&apos;ve Never Said</ChapterLabel>
        <Reveal testId="heading-never-said">
          <h2 className="chapter-heading" id="never-said-title">
            The things that are easiest to <em>keep.</em>
          </h2>
        </Reveal>
        <Reveal delay={1} testId="copy-never-said">
          <p className="chapter-lede">
            Tap a card. No grand reveal — just three small truths, saved here for you.
          </p>
        </Reveal>
        <div className="secret-grid" data-testid="reveals-never-said">
          {secrets.map((secret, index) => {
            const isOpen = openSecret === index;
            return (
              <button
                className="secret-card"
                type="button"
                key={secret}
                aria-expanded={isOpen}
                onClick={() => setOpenSecret(isOpen ? null : index)}
                data-testid={`button-reveal-secret-${index + 1}`}
              >
                <span className="secret-card-top">
                  <span>kept note / 0{index + 1}</span>
                  <span className="secret-plus" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                </span>
                <span className="secret-card-body">
                  {isOpen ? <span className="reveal-line">{secret}</span> : <span className="reveal-prompt">Open this carefully.</span>}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="chapter" id="twenty" aria-labelledby="twenty-title">
        <ChapterLabel number="05">Twenty</ChapterLabel>
        <Reveal testId="heading-twenty">
          <h2 className="chapter-heading" id="twenty-title">
            A number, briefly.<br />
            A threshold, <em>maybe.</em>
          </h2>
        </Reveal>
        <div className="number-section">
          <Reveal delay={1} testId="number-twenty">
            <p className="big-twenty" aria-label="Twenty">20</p>
          </Reveal>
          <Reveal delay={2} testId="copy-twenty">
            <div className="twenty-copy">
              <p>
                Let this year be less about arriving at a version of yourself and more about meeting the versions
                already here. The certain one. The changing one. The one that does not have an answer yet.
              </p>
              <p>
                There is no correct way to enter a new decade. There is only your way, becoming clearer as you go.
              </p>
              <span className="rule-note">Keep what feels true</span>
            </div>
          </Reveal>
        </div>
        <Reveal delay={3} testId="visual-twenty">
          <div style={{ marginTop: '84px' }}>
            <EnvelopePlaceholder label="this chapter" />
          </div>
        </Reveal>
      </section>

      <section className="chapter" id="a-letter" aria-labelledby="a-letter-title">
        <ChapterLabel number="06">A Letter</ChapterLabel>
        <Reveal testId="heading-a-letter">
          <h2 className="chapter-heading" id="a-letter-title">
            Read this when the page feels <em>far away.</em>
          </h2>
        </Reveal>
        <Reveal delay={1} testId="letter-a-letter">
          <article className="letter-wrap">
            <p className="letter-greeting">Dear Anusha,</p>
            <div className="letter-body">
              <p>
                I hope you keep a little space for the parts of life that cannot be planned into a neat line. The
                pauses. The changed minds. The quiet yes.
              </p>
              <p>
                I hope you know that you do not have to make yourself smaller to make a place for someone else. Your
                full attention, your questions, your way of caring — they are not too much. They are the point.
              </p>
              <p>
                Twenty looks good on you because it is not asking you to be certain. It is asking you to stay close to
                what you know, and curious about what you do not.
              </p>
              <p>For everything ahead, and for all the ordinary days that will matter just as much.</p>
              <p className="letter-signoff">With a full heart,<br />always</p>
            </div>
          </article>
        </Reveal>
      </section>

      <section className="chapter always" id="always" aria-labelledby="always-title">
        <ChapterLabel number="07">Always</ChapterLabel>
        <Reveal testId="heading-always">
          <h2 className="chapter-heading" id="always-title">
            For the pages we haven&apos;t <em>read.</em>
          </h2>
        </Reveal>
        <Reveal delay={1} testId="copy-always">
          <p className="chapter-lede" style={{ marginRight: 'auto', marginLeft: 'auto' }}>
            Whatever changes, I hope you keep finding reasons to be surprised by your own life.
          </p>
        </Reveal>
        <Reveal delay={2} testId="mark-always">
          <div className="always-mark" aria-hidden="true" />
        </Reveal>
      </section>

      <footer className="footer">
        <p data-testid="text-footer-signature">Made for Anusha Gupta / 20</p>
        <p><button className="print-button" type="button" onClick={() => window.print()} data-testid="button-print-keepsake">Print this keepsake</button></p>
      </footer>
    </main>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={TributePage} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;