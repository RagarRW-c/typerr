import { useEffect, useRef } from 'react';

interface ParticleEffect {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

let particles: ParticleEffect[] = [];

export function createTypingParticle(x: number, y: number, isCorrect: boolean) {
  const count = 3;
  const color = isCorrect 
    ? `rgba(16, 185, 129, ${Math.random() * 0.5 + 0.5})` // green
    : `rgba(239, 68, 68, ${Math.random() * 0.5 + 0.5})`;  // red

  for (let i = 0; i < count; i++) {
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3 - 2,
      life: 1,
      color,
      size: Math.random() * 3 + 2,
    });
  }
}

export default function TypingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles = particles.filter(p => p.life > 0);

      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.1; // gravity
        particle.life -= 0.02;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace(/[\d.]+\)$/g, `${particle.life})`);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ background: 'transparent' }}
    />
  );
}
