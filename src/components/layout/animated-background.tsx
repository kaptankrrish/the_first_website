'use client';
import { useEffect, useRef } from 'react';
import { useTheme } from '@/components/layout/theme-provider';

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; hue: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Reduced count on mobile for performance
    const particleCount = window.innerWidth < 768 ? 40 : 80;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        size: Math.random() * 1.6 + 0.4,
        alpha: Math.random() * 0.25 + 0.06,
        hue: 200 + Math.random() * 80, // blue to purple
      });
    }

    const animate = () => {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      const isDark = resolvedTheme === 'dark';
      const baseColor = isDark ? '255,255,255' : '0,0,0';

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas!.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas!.height) p.vy *= -1;

        // Soft glow on particles
        const gradient = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        gradient.addColorStop(0, `hsla(${p.hue}, 80%, 70%, ${p.alpha})`);
        gradient.addColorStop(1, `hsla(${p.hue}, 80%, 70%, 0)`);
        ctx!.fillStyle = gradient;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx!.fill();

        // Core dot
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${baseColor},${p.alpha * 1.4})`;
        ctx!.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = p.x - particles[j].x;
          const dy = p.y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx!.beginPath();
            ctx!.moveTo(p.x, p.y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            const alpha = 0.05 * (1 - dist / 110);
            ctx!.strokeStyle = isDark
              ? `rgba(147, 197, 253, ${alpha})`
              : `rgba(99, 102, 241, ${alpha * 0.4})`;
            ctx!.lineWidth = 0.6;
            ctx!.stroke();
          }
        }
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [resolvedTheme]);

  return (
    <>
      {/* Aurora gradient layers (CSS, GPU-accelerated) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-mesh" />
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-[120px] animate-aurora" />
        <div
          className="absolute -top-20 right-0 w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[120px] animate-aurora"
          style={{ animationDelay: '-6s' }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-[600px] h-[600px] rounded-full bg-pink-500/8 blur-[140px] animate-aurora"
          style={{ animationDelay: '-12s' }}
        />
        <div className="absolute inset-0 grid-pattern opacity-30" />
      </div>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
    </>
  );
}
