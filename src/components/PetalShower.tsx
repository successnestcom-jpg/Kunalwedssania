import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

interface PetalShowerProps {
  burstTrigger: number;
  petalColors?: string[];
}

interface PetalParticle {
  x: number;
  y: number;
  size: number;
  color: string;
  vx: number;
  vy: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  rotSpeedX: number;
  rotSpeedY: number;
  rotSpeedZ: number;
  opacity: number;
}

export const PetalShower: React.FC<PetalShowerProps> = ({
  burstTrigger,
  petalColors = ['#850B1B', '#E11D48', '#F472B6', '#FFFDF7', '#D4AF37', '#059669'],
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<PetalParticle[]>([]);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (burstTrigger > 0) {
      // Trigger canvas-confetti burst with luxury gold, red & rose colors
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.65 },
        colors: petalColors,
        scalar: 1.1,
      });

      // Spawn 60 natural 3D falling petals on our canvas
      const canvas = canvasRef.current;
      if (!canvas) return;
      const width = canvas.width;
      const height = canvas.height;

      const newParticles: PetalParticle[] = Array.from({ length: 60 }, () => {
        const color = petalColors[Math.floor(Math.random() * petalColors.length)];
        return {
          x: Math.random() * width,
          y: -20 - Math.random() * 80,
          size: Math.random() * 12 + 10,
          color,
          vx: (Math.random() - 0.5) * 2.2,
          vy: Math.random() * 2.5 + 2.0,
          rotX: Math.random() * Math.PI,
          rotY: Math.random() * Math.PI,
          rotZ: Math.random() * Math.PI,
          rotSpeedX: (Math.random() - 0.5) * 0.05,
          rotSpeedY: (Math.random() - 0.5) * 0.06,
          rotSpeedZ: (Math.random() - 0.5) * 0.04,
          opacity: 1,
        };
      });

      particlesRef.current.push(...newParticles);
    }
  }, [burstTrigger, petalColors]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx + Math.sin(p.y * 0.02) * 1.2;
        p.y += p.vy;
        p.rotX += p.rotSpeedX;
        p.rotY += p.rotSpeedY;
        p.rotZ += p.rotSpeedZ;

        if (p.y > canvas.height - 50) {
          p.opacity -= 0.025;
        }

        if (p.opacity <= 0 || p.y > canvas.height + 20) {
          return false;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotZ);
        ctx.scale(Math.cos(p.rotX), Math.sin(p.rotY));
        ctx.globalAlpha = Math.max(0, p.opacity);

        // Draw organic curved petal shape
        ctx.beginPath();
        ctx.moveTo(0, -p.size / 2);
        ctx.bezierCurveTo(p.size * 0.6, -p.size * 0.3, p.size * 0.6, p.size * 0.3, 0, p.size / 2);
        ctx.bezierCurveTo(-p.size * 0.6, p.size * 0.3, -p.size * 0.6, -p.size * 0.3, 0, -p.size / 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Subtle petal vein highlight
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 0.3);
        ctx.lineTo(0, p.size * 0.3);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();
        return true;
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
      style={{ pointerEvents: 'none' }}
    />
  );
};
