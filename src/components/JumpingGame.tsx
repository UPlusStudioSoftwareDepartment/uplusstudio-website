'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';

const JUMP_DURATION_MS = 600;
const ROAD_LINE_COUNT = 4;
const BASE_MS_PER_UNIT = 50; 
const SPEED_INTERVAL_MS = 1000;
const SPEED_INCREASE_INTERVAL = 5;
const MAX_GAME_SPEED = 20;
const SPEED_INCREMENT = 0.3;
const OBSTACLE_SPAWN_POSITION = 100;
const OBSTACLE_OFFSCREEN_THRESHOLD = -15;
const PLAYER_X_PERCENT = 40;

const SHAPE_CLIP_PATHS: Record<string, string> = {
  triangle: 'polygon(50% 0%, 0% 100%, 100% 100%)',
  pentagon: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
  diamond: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
  hexagon: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
  star: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
  spike: 'polygon(50% 0%, 0% 100%, 100% 100%)',
  chevron: 'polygon(0% 100%, 50% 0%, 100% 100%)',
  trapezoid: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
  cross: 'polygon(40% 0%, 60% 0%, 60% 40%, 100% 40%, 100% 60%, 60% 60%, 60% 100%, 40% 100%, 40% 60%, 0% 60%, 0% 40%, 40% 40%)',
  arrow: 'polygon(0% 50%, 40% 0%, 40% 30%, 100% 30%, 100% 70%, 40% 70%, 40% 100%)',
  heart: 'polygon(50% 0%, 100% 35%, 82% 35%, 65% 15%, 50% 30%, 35% 15%, 18% 35%, 0% 35%, 50% 100%)',
  lightning: 'polygon(50% 0%, 60% 40%, 100% 40%, 70% 50%, 90% 100%, 50% 60%, 10% 100%, 30% 50%, 0% 40%, 40% 40%)',
  crescent: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
  moon: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
  sun: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
  cloud: 'polygon(20% 50%, 30% 20%, 50% 10%, 70% 20%, 80% 50%, 70% 80%, 50% 90%, 30% 80%)',
  wave: 'polygon(0% 50%, 25% 20%, 50% 50%, 75% 80%, 100% 50%, 75% 20%, 50% 50%, 25% 80%)',
  mountain: 'polygon(50% 0%, 0% 100%, 100% 100%)',
  volcano: 'polygon(50% 0%, 30% 40%, 0% 100%, 100% 100%, 70% 40%)',
  tree: 'polygon(50% 0%, 40% 30%, 35% 60%, 30% 100%, 70% 100%, 65% 60%, 60% 30%)',
  flower: 'polygon(50% 0%, 61% 25%, 98% 25%, 68% 50%, 79% 75%, 50% 60%, 21% 75%, 32% 50%, 2% 25%, 39% 25%)',
  leaf: 'polygon(50% 0%, 75% 25%, 100% 50%, 75% 75%, 50% 100%, 25% 75%, 0% 50%, 25% 25%)',
  feather: 'polygon(50% 0%, 60% 30%, 70% 50%, 60% 70%, 50% 100%, 40% 70%, 30% 50%, 40% 30%)',
  wing: 'polygon(0% 50%, 50% 0%, 100% 50%, 50% 100%)',
  helmet: 'polygon(20% 0%, 80% 0%, 100% 30%, 100% 70%, 80% 100%, 20% 100%, 0% 70%, 0% 30%)',
  shield: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
  sword: 'polygon(45% 0%, 55% 0%, 60% 100%, 40% 100%)',
  crown: 'polygon(50% 0%, 60% 30%, 80% 30%, 90% 60%, 100% 100%, 0% 100%, 10% 60%, 20% 30%, 40% 30%)',
  key: 'polygon(30% 0%, 70% 0%, 70% 40%, 100% 40%, 100% 60%, 70% 60%, 70% 100%, 30% 100%, 30% 60%, 0% 60%, 0% 40%, 30% 40%)',
  lock: 'polygon(20% 0%, 80% 0%, 80% 40%, 100% 40%, 100% 60%, 80% 60%, 80% 100%, 20% 100%, 20% 60%, 0% 60%, 0% 40%, 20% 40%)',
  gear: 'polygon(50% 0%, 61% 20%, 80% 20%, 90% 50%, 80% 80%, 61% 80%, 50% 100%, 39% 80%, 20% 80%, 10% 50%, 20% 20%, 39% 20%)',
  wheel: 'polygon(50% 0%, 61% 25%, 98% 25%, 68% 50%, 98% 75%, 61% 75%, 50% 100%, 39% 75%, 2% 75%, 32% 50%, 2% 25%, 39% 25%)',
  cube: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
  sphere: 'polygon(50% 0%, 61% 20%, 80% 30%, 90% 50%, 80% 70%, 61% 80%, 50% 100%, 39% 80%, 20% 70%, 10% 50%, 20% 30%, 39% 20%)',
  cylinder: 'polygon(30% 0%, 70% 0%, 70% 80%, 30% 80%)',
  cone: 'polygon(50% 0%, 100% 100%, 0% 100%)',
  prism: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)',
  crystal: 'polygon(50% 0%, 60% 30%, 80% 50%, 60% 70%, 50% 100%, 40% 70%, 20% 50%, 40% 30%)',
  gem: 'polygon(50% 0%, 61% 25%, 90% 40%, 75% 75%, 50% 100%, 25% 75%, 10% 40%, 39% 25%)',
  fire: 'polygon(50% 0%, 61% 30%, 70% 40%, 80% 60%, 70% 80%, 50% 100%, 30% 80%, 20% 60%, 30% 40%, 39% 30%)',
  flame: 'polygon(50% 0%, 60% 20%, 70% 30%, 60% 50%, 70% 70%, 50% 100%, 30% 70%, 40% 50%, 30% 30%, 40% 20%)',
  ice: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
  snowflake: 'polygon(50% 0%, 61% 25%, 75% 25%, 75% 50%, 100% 50%, 75% 50%, 75% 75%, 61% 75%, 50% 100%, 39% 75%, 25% 75%, 25% 50%, 0% 50%, 25% 50%, 25% 25%, 39% 25%)',
  rainbow: 'polygon(0% 80%, 100% 80%, 100% 100%, 0% 100%)',
  spiral: 'polygon(50% 0%, 61% 20%, 80% 30%, 70% 50%, 80% 70%, 61% 80%, 50% 100%, 39% 80%, 20% 70%, 30% 50%, 20% 30%, 39% 20%)',
  infinity: 'polygon(20% 50%, 30% 20%, 50% 20%, 70% 50%, 50% 80%, 30% 80%)',
};

function getClipPathForShape(shape: string): string {
  for (const [key, value] of Object.entries(SHAPE_CLIP_PATHS)) {
    if (shape.includes(key)) return value;
  }
  return 'none';
}

function getBorderRadiusForShape(shape: string): string {
  if (shape.includes('oval') || shape.includes('circle')) return '50%';
  if (shape.includes('arch') || shape.includes('dome')) return '50% 50% 0 0';
  if (shape.includes('rounded')) return '20%';
  if (shape.includes('sharp')) return '0%';
  return '8%';
}

const SHAPES = [
  'triangle', 'pentagon', 'diamond', 'hexagon', 'star', 'spike',
  'chevron', 'trapezoid', 'cross', 'arrow', 'circle', 'oval',
  'arch', 'dome', 'sharp', 'rounded', 'heart', 'lightning',
  'rotated', 'square-building', 'skyscraper', 'tower', 'pyramid',
  'crescent', 'moon', 'sun', 'cloud', 'wave', 'mountain', 'volcano',
  'tree', 'flower', 'leaf', 'feather', 'wing', 'helmet', 'shield',
  'sword', 'crown', 'key', 'lock', 'gear', 'wheel', 'clock', 'compass',
  'cube', 'sphere', 'cylinder', 'cone', 'crystal', 'gem', 'fire', 'flame',
  'ice', 'snowflake', 'rainbow', 'spiral', 'infinity',
] as const;

function generateRandomObstacle() {
  const randomShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  
  const maxObstacleWidth = 12;
  const minObstacleWidth = 3;
  
  let randomHeight, randomWidth;
  if (randomShape === 'star') {
    randomHeight = Math.floor(Math.random() * 25) + 35; 
    randomWidth = Math.floor(Math.random() * (maxObstacleWidth - 6)) + 6; 
  } else {
    randomHeight = Math.floor(Math.random() * 30) + 15; 
    randomWidth = Math.floor(Math.random() * (maxObstacleWidth - minObstacleWidth + 1)) + minObstacleWidth; 
  }
  
  return {
    width: randomWidth,
    height: randomHeight,
    shape: randomShape,
    color: 'bg-white'
  };
}

export default function JumpingGame() {
  const [score, setScore] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [obstaclePosition, setObstaclePosition] = useState(100);
  const [gameOver, setGameOver] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(1.8);
  const [survivalTime, setSurvivalTime] = useState(0);
  const [roadLines, setRoadLines] = useState<Array<{id: number, position: number}>>([]);
  
  const lineIdRef = useRef(0);
  
  const [currentObstacle, setCurrentObstacle] = useState(generateRandomObstacle);

  const handleJump = useCallback(() => {
    if (!isJumping && gameStarted && !gameOver) {
      setIsJumping(true);
      setTimeout(() => setIsJumping(false), JUMP_DURATION_MS);
    }
  }, [isJumping, gameStarted, gameOver]);



  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setObstaclePosition(OBSTACLE_SPAWN_POSITION);
    setGameOver(false);
    setGameSpeed(1.8);
    setSurvivalTime(0);
    setCurrentObstacle(generateRandomObstacle());
    const initialLines = Array.from({ length: ROAD_LINE_COUNT }, (_, i) => ({
      id: ++lineIdRef.current,
      position: 20 + (i * 30),
    }));
    setRoadLines(initialLines);
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setObstaclePosition(OBSTACLE_SPAWN_POSITION);
    setGameSpeed(1.8);
    setSurvivalTime(0);
    setRoadLines([]);
  };

  const gameSpeedRef = useRef(gameSpeed);
  useEffect(() => {
    gameSpeedRef.current = gameSpeed;
  }, [gameSpeed]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    let lastTime = performance.now();
    let rafId: number;

    const gameLoop = (now: number) => {
      const deltaMs = now - lastTime;
      lastTime = now;
      const speed = gameSpeedRef.current;
      const deltaUnits = (deltaMs / BASE_MS_PER_UNIT) * speed;

      setRoadLines((prevLines) => {
        const moved = prevLines.map((line) => ({ ...line, position: line.position - deltaUnits }));
        const visible = moved.filter((line) => line.position > -10);
        if (visible.length < ROAD_LINE_COUNT) {
          visible.push({ id: ++lineIdRef.current, position: 110 });
        }
        return visible;
      });

      setObstaclePosition((prev) => {
        const newPosition = prev - deltaUnits;
        if (newPosition <= OBSTACLE_OFFSCREEN_THRESHOLD) {
          setCurrentObstacle(generateRandomObstacle());
          return OBSTACLE_SPAWN_POSITION;
        }
        return newPosition;
      });

      rafId = requestAnimationFrame(gameLoop);
    };

    rafId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(rafId);
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;
    const speedInterval = setInterval(() => {
      setSurvivalTime((prev) => {
        const next = prev + 1;
        if (next > 0 && next % SPEED_INCREASE_INTERVAL === 0) {
          setGameSpeed((s) => Math.min(s + SPEED_INCREMENT, MAX_GAME_SPEED));
        }
        return next;
      });
      setScore((prev) => prev + 1);
    }, SPEED_INTERVAL_MS);
    return () => clearInterval(speedInterval);
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const obstacleX = obstaclePosition;
      const playerX = PLAYER_X_PERCENT;
      const playerY = isJumping ? -80 : 0;
      
      const playerLeft = playerX + 2; 
      const playerRight = playerX + 6; 
      const playerTop = playerY;
      const playerBottom = 0;
      
      const obstacleLeft = obstacleX + 2; 
      const obstacleRight = obstacleX + currentObstacle.width - 2;
      const obstacleTop = -currentObstacle.height + 4; 
      const obstacleBottom = 0;
      
      const horizontalOverlap = playerRight >= obstacleLeft && playerLeft <= obstacleRight;
      const verticalOverlap = playerBottom >= obstacleTop && playerTop <= obstacleBottom;
      
      if (horizontalOverlap && verticalOverlap && !isJumping) {
        const frame = requestAnimationFrame(() => setGameOver(true));
        return () => cancelAnimationFrame(frame);
      }
    }
  }, [obstaclePosition, isJumping, gameStarted, gameOver, currentObstacle]);

  const handleGameAreaActivate = () => {
    if (gameStarted && !gameOver) handleJump();
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted || gameOver) return;
      
      switch(e.key.toLowerCase()) {
        case ' ':
        case 'space':
        case 'w':
        case 'arrowup':
          e.preventDefault();
          handleJump();
          break;
      }
    };

    globalThis.addEventListener('keydown', handleKeyPress);

    return () => {
      globalThis.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameStarted, gameOver, handleJump]);

  return (
    <div className="bg-transparent rounded-lg p-4 max-w-sm mx-auto" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
        <h2 className="text-md font-bold mb-2 text-white">Sıkıldın mı? Oyun oyna!</h2>
        <p className="text-white/70 text-xs mb-4">Engellerden zıplayarak kaçın! Hız zamanla artar!</p>
        
        {gameStarted ? (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="text-base font-bold text-white">
              {gameOver ? 'Oyun Bitti!' : `Skor: ${score}`}
            </div>
            <div className="flex items-center gap-2">
              <div className="text-xs text-white/60">
                Hız: {gameSpeed.toFixed(1)}x | Süre: {survivalTime}s
              </div>
              <button
                onClick={resetGame}
                className="w-5 h-5 bg-white/10 hover:bg-black hover:text-white text-white rounded-full flex items-center justify-center transition-colors"
                title="Oyunu Kapat"
              >
                ×
              </button>
            </div>
          </div>
          
          <button
            type="button"
            className="relative bg-black rounded-lg overflow-hidden cursor-pointer w-full aspect-video max-h-24 block text-left border-0 p-0"
            onClick={handleGameAreaActivate}
            onTouchStart={handleGameAreaActivate}
            onKeyDown={(e) => {
              if ([' ', 'Enter'].includes(e.key)) {
                e.preventDefault();
                handleGameAreaActivate();
              }
            }}
            aria-label="Oyun alanı - zıplamak için tıklayın veya dokunun"
          >
            {gameOver && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10">
                <div className="text-white text-sm mb-4">Toplam Puan: {score}</div>
              </div>
            )}
            
            <div className="absolute bottom-0 w-full h-1 bg-white"></div>
            
            {roadLines.map((line) => (
              <div
                key={line.id}
                className="absolute bottom-2 w-1 h-0.5 bg-white/20 rounded-full"
                style={{ left: `${line.position}%` }}
              />
            ))}
            
            <motion.div
              className="absolute bottom-1 w-6 h-6 bg-white rounded-full"
              style={{ left: `${PLAYER_X_PERCENT}%` }}
              animate={{
                y: isJumping ? -60 : 0,
              }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 12,
                mass: 0.8
              }}
            />
            
            <div
              className="absolute bottom-1 bg-white"
              style={{
                left: `${obstaclePosition}%`,
                width: `${currentObstacle.width}%`,
                height: `${currentObstacle.height}%`,
                borderRadius: getBorderRadiusForShape(currentObstacle.shape),
                clipPath: getClipPathForShape(currentObstacle.shape),
                transform: currentObstacle.shape.includes('rotated') ? 'rotate(45deg)' : 'none',
              }}
            />
          </button>
          
          <div className="flex gap-2 justify-center">
            {gameOver && (
              <button
                onClick={startGame}
                className="bg-white hover:bg-black hover:text-white text-black font-semibold py-1.5 px-3 rounded-lg transition-colors text-xs"
                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
              >
                Tekrar Oyna
              </button>
            )}
          </div>
          
          <div className="mt-2 text-center">
            <p className="text-white/55 text-xs font-medium">Zıpla</p>
            <p className="text-xs text-white/50">Mobil: Ekrana dokun | Klavye: Boşluk/W/↑</p>
          </div>
        </div>
        ) : (
          <button
            onClick={startGame}
            className="bg-white hover:bg-black hover:text-white text-black font-semibold py-1.5 px-3 rounded-sm transition-colors text-xs"
            style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
          >
            Oyunu Başlat
          </button>
        )}
    </div>
  );
}
