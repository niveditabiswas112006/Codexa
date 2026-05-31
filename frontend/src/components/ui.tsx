import { motion, useTransform, useScroll } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

type FadeInProps = {
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  className?: string;
  children: React.ReactNode;
};

export const FadeIn = ({
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  className,
  children
}: FadeInProps) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ delay, duration, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
};

type ContactButtonProps = {
  className?: string;
  href?: string;
};

export const ContactButton = ({ className, href }: ContactButtonProps) => {
  const classNames = `inline-flex items-center justify-center rounded-full uppercase tracking-widest text-white font-medium text-xs sm:text-sm md:text-base px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 ${className ?? ''}`;
  const styles = {
    background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
    boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), inset 4px 4px 12px #7721B1',
    outline: '2px solid rgba(255,255,255,0.16)',
    outlineOffset: '-3px'
  };

  if (href) {
    return (
      <a href={href} className={classNames} style={styles}>
        Login In
      </a>
    );
  }

  return (
    <button type="button" className={classNames} style={styles}>
      Login In
    </button>
  );
};

type LiveProjectButtonProps = {
  className?: string;
};

export const LiveProjectButton = ({ className }: LiveProjectButtonProps) => (
  <button
    type="button"
    className={`rounded-full border-2 border-[#D7E2EA] uppercase tracking-widest text-[#D7E2EA] font-medium text-sm sm:text-base px-8 py-3 sm:px-10 sm:py-3.5 transition hover:bg-[#D7E2EA]/10 ${className ?? ''}`}
  >
    Live Project
  </button>
);

type MagnetProps = {
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
  children: React.ReactNode;
};

export const Magnet = ({
  padding = 150,
  strength = 3,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
  className,
  children
}: MagnetProps) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [transformStyle, setTransformStyle] = useState('translate3d(0px, 0px, 0px)');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const element = wrapperRef.current;
    if (!element) return;

    const onMouseMove = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const distance = padding;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;
      const withinX = event.clientX >= rect.left - distance && event.clientX <= rect.right + distance;
      const withinY = event.clientY >= rect.top - distance && event.clientY <= rect.bottom + distance;
      if (withinX && withinY) {
        setIsActive(true);
        setTransformStyle(`translate3d(${dx / strength}px, ${dy / strength}px, 0)`);
      } else {
        setIsActive(false);
        setTransformStyle('translate3d(0px, 0px, 0px)');
      }
    };

    const onMouseLeave = () => {
      setIsActive(false);
      setTransformStyle('translate3d(0px, 0px, 0px)');
    };

    window.addEventListener('mousemove', onMouseMove);
    element.addEventListener('mouseleave', onMouseLeave);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      element.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [padding, strength]);

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{
        transform: transformStyle,
        transition: isActive ? activeTransition : inactiveTransition,
        willChange: 'transform'
      }}
    >
      {children}
    </div>
  );
};

type AnimatedTextProps = {
  text: string;
  className?: string;
};

export const AnimatedText = ({ text, className }: AnimatedTextProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2']
  });

  return (
    <div ref={containerRef} className={`block text-center ${className ?? ''}`}>
      {Array.from(text).map((char, index) => {
        const progressStart = Math.max(0, index / Math.max(1, text.length) - 0.08);
        const progressEnd = Math.min(1, index / Math.max(1, text.length) + 0.08);
        const opacity = useTransform(scrollYProgress, [progressStart, progressEnd], [0.2, 1]);
        return (
          <span key={`${char}-${index}`} className="relative inline-block whitespace-pre">
            <span className="invisible">{char}</span>
            <motion.span className="absolute inset-0" style={{ opacity }}>
              {char}
            </motion.span>
          </span>
        );
      })}
    </div>
  );
};
