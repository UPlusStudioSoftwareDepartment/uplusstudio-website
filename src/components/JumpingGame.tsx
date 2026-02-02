'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function JumpingGame() {
  const [score, setScore] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [obstaclePosition, setObstaclePosition] = useState(100);
  const [gameOver, setGameOver] = useState(false);
  const [playerPosition, setPlayerPosition] = useState(10);
  const [gameSpeed, setGameSpeed] = useState(1.8);
  const [survivalTime, setSurvivalTime] = useState(0);
  const [roadLines, setRoadLines] = useState<Array<{id: number, position: number}>>([]);
  
  const generateRandomObstacle = () => {
    const shapes = [
      'triangle', 'pentagon', 'diamond', 'hexagon', 'star', 'spike', 
      'chevron', 'trapezoid', 'cross', 'arrow', 'circle', 'oval',
      'arch', 'dome', 'sharp', 'rounded', 'heart', 'lightning',
      'rotated', 'square-building', 'skyscraper', 'tower', 'pyramid', 
      'pentagon-building', 'star-building', 'tower-thin', 'horizontal-building', 
      'diamond-building', 'hexagon-building', 'spike-building', 'platform', 
      'oval-building', 'arch-building', 'dome-building', 'bridge-support', 
      'chimney', 'factory', 'monument', 'apartment', 'church-tower', 
      'office-building', 'radio-tower', 'windmill', 'silo', 'lighthouse', 
      'castle-tower', 'minaret', 'warehouse', 'crane', 'water-tower', 
      'observatory', 'bell-tower', 'control-tower', 'pagoda', 'antenna-tower',
      'pavilion', 'rotunda', 'gazebo', 'watchtower', 'steeple', 'bunker', 
      'pylon', 'fountain', 'dam', 'obelisk', 'mausoleum', 'torii', 'archway', 
      'spire', 'dome-structure', 'colonnade', 'monolith', 'statue-base',
      // More diverse shapes
      'crescent', 'moon', 'sun', 'cloud', 'wave', 'mountain', 'volcano',
      'tree', 'flower', 'leaf', 'feather', 'wing', 'helmet', 'shield',
      'sword', 'crown', 'key', 'lock', 'gear', 'wheel', 'clock', 'compass',
      'anchor', 'ship', 'plane', 'rocket', 'satellite', 'planet', 'atom',
      'dna', 'molecule', 'crystal', 'gem', 'diamond-cut', 'emerald', 'ruby',
      'light-bulb', 'flash', 'bolt', 'fire', 'flame', 'ice', 'snowflake',
      'rainbow', 'spiral', 'infinity', 'knot', 'chain', 'rope', 'net',
      'web', 'grid', 'matrix', 'pixel', 'cube', 'sphere', 'cylinder', 'cone',
      'pyramid-3d', 'prism', 'lens', 'mirror', 'window', 'door', 'gate',
      'bridge', 'tunnel', 'road', 'path', 'maze', 'labyrinth', 'puzzle',
      'piece', 'tile', 'brick', 'stone', 'rock', 'boulder', 'pebble',
      'sand', 'dust', 'wind', 'air', 'bubble', 'drop', 'splash', 'wave-ring',
      'ripple', 'echo', 'shadow', 'reflection', 'silhouette', 'outline',
      'frame', 'border', 'edge', 'corner', 'angle', 'curve', 'arc', 'bend',
      'twist', 'turn', 'rotate', 'spin', 'flip', 'fold', 'unfold', 'expand',
      'shrink', 'grow', 'rise', 'fall', 'climb', 'descend', 'ascend', 'dive',
      'jump', 'leap', 'bound', 'spring', 'bounce', 'float', 'hover', 'glide',
      'soar', 'fly', 'wing', 'tail', 'fin', 'beak', 'claw', 'talon', 'paw',
      'hoof', 'horn', 'antler', 'tusk', 'trunk', 'mane', 'fur', 'feather',
      'scale', 'shell', 'exoskeleton', 'carapace', 'armor', 'helmet', 'mask',
      'face', 'head', 'eye', 'nose', 'mouth', 'ear', 'hand', 'foot', 'leg',
      'arm', 'body', 'torso', 'chest', 'back', 'spine', 'bone', 'skull',
      'skeleton', 'ghost', 'spirit', 'soul', 'heart', 'brain', 'mind', 'thought',
      'idea', 'dream', 'nightmare', 'vision', 'sight', 'sound', 'noise', 'silence',
      'voice', 'whisper', 'shout', 'scream', 'laugh', 'cry', 'tear', 'smile',
      'frown', 'grin', 'grimace', 'expression', 'emotion', 'feeling', 'mood',
      'attitude', 'character', 'personality', 'identity', 'self', 'ego', 'id'
    ];
    
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    
    // Player width is 6 (from playerLeft: 40, playerRight: 46)
    // Maximum obstacle width = 2 * player width = 12
    // But we use percentage, so player is about 6% width
    // Max obstacle width = 12% (2x player width)
    const maxObstacleWidth = 12;
    const minObstacleWidth = 3;
    
    let randomHeight, randomWidth;
    if (randomShape === 'star') {
      randomHeight = Math.floor(Math.random() * 25) + 35; // 35-60 height for stars
      randomWidth = Math.floor(Math.random() * (maxObstacleWidth - 6)) + 6; // 6-12 width for stars
    } else {
      randomHeight = Math.floor(Math.random() * 30) + 15; // 15-44 height for others
      randomWidth = Math.floor(Math.random() * (maxObstacleWidth - minObstacleWidth + 1)) + minObstacleWidth; // 3-12 width for others
    }
    
    return {
      width: randomWidth,
      height: randomHeight,
      shape: randomShape,
      color: 'bg-white'
    };
  };
  
  const [currentObstacle, setCurrentObstacle] = useState(generateRandomObstacle());

  const handleJump = () => {
    if (!isJumping && gameStarted && !gameOver) {
      setIsJumping(true);
      setTimeout(() => setIsJumping(false), 600);
    }
  };



  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setObstaclePosition(100);
    setGameOver(false);
    setPlayerPosition(40); // Fixed center position
    setGameSpeed(1.8);
    setSurvivalTime(0);
    setCurrentObstacle(generateRandomObstacle()); // Generate random obstacle
    
    // Initialize road lines (reduced from 8 to 4)
    const initialLines = [];
    for (let i = 0; i < 4; i++) {
      initialLines.push({
        id: Date.now() + i,
        position: 20 + (i * 30) // Increased spacing for fewer dots
      });
    }
    setRoadLines(initialLines);
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setObstaclePosition(100);
    setPlayerPosition(40); // Fixed center position
    setGameSpeed(1.8);
    setSurvivalTime(0);
    setRoadLines([]); // Clear road lines
  };

  // Move road lines continuously
  useEffect(() => {
    if (gameStarted && !gameOver) {
      const interval = setInterval(() => {
        setRoadLines((prevLines) => {
          let newLines = prevLines.map(line => ({
            ...line,
            position: line.position - gameSpeed
          })).filter(line => line.position > -10);
          
          // Add new road lines periodically (reduced from 8 to 4)
          if (newLines.length < 4) {
            newLines.push({
              id: Date.now() + Math.random(),
              position: 110
            });
          }
          
          return newLines;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [gameStarted, gameOver, gameSpeed]);

  // Move single obstacle
  useEffect(() => {
    if (gameStarted && !gameOver) {
      const interval = setInterval(() => {
        setObstaclePosition((prev) => {
          const newPosition = prev - gameSpeed;
          
          // When obstacle goes off screen, spawn new one
          if (newPosition <= -15) {
            // Generate new random obstacle
            setCurrentObstacle(generateRandomObstacle());
            return 100; // Spawn new obstacle from right
          }
          return newPosition;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [gameStarted, gameOver, gameSpeed]);

  // Increase speed and score over time (survival based)
  useEffect(() => {
    if (gameStarted && !gameOver) {
      const speedInterval = setInterval(() => {
        setSurvivalTime((prev) => prev + 1);
        setScore((prev) => prev + 1);
        
        // Increase speed every 5 seconds
        if (survivalTime > 0 && survivalTime % 5 === 0) {
          setGameSpeed((prev) => Math.min(prev + 0.3, 20)); // Max speed 8
        }
      }, 1000);

      return () => clearInterval(speedInterval);
    }
  }, [gameStarted, gameOver, survivalTime]);

  // Check collision with fixed player position (Google Doodle style)
  useEffect(() => {
    if (gameStarted && !gameOver) {
      const obstacleX = obstaclePosition;
      const playerX = 40; // Fixed center position
      const playerY = isJumping ? -80 : 0;
      
      // Very reduced collision detection area (almost no tolerance)
      const playerLeft = playerX + 2; // Much smaller player collision area
      const playerRight = playerX + 6; // Much smaller player collision area
      const playerTop = playerY;
      const playerBottom = 0;
      
      const obstacleLeft = obstacleX + 2; // Much smaller obstacle collision area
      const obstacleRight = obstacleX + currentObstacle.width - 2;
      const obstacleTop = -currentObstacle.height + 4; // Much smaller height collision
      const obstacleBottom = 0;
      
      // Check if boxes overlap with very reduced sensitivity
      const horizontalOverlap = playerRight >= obstacleLeft && playerLeft <= obstacleRight;
      const verticalOverlap = playerBottom >= obstacleTop && playerTop <= obstacleBottom;
      
      // Only trigger game over if actually colliding (not just overlapping)
      if (horizontalOverlap && verticalOverlap && !isJumping) {
        // All buildings cause game over when not jumping
        setGameOver(true);
      }
    }
  }, [obstaclePosition, isJumping, gameStarted, gameOver, currentObstacle]);

  // Mobile touch controls - jump only
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!gameStarted || gameOver) return;
    
    // Any touch on game area triggers jump
    handleJump();
  };

  // Mouse controls for desktop - jump only
  const handleMouseClick = (e: React.MouseEvent) => {
    if (!gameStarted || gameOver) return;
    
    // Any click on game area triggers jump
    handleJump();
  };

  // Keyboard controls
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

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameStarted, gameOver, isJumping]);

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <div className="bg-transparent rounded-lg p-4 max-w-sm mx-auto" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
        <h2 className="text-md font-bold mb-2 text-white">Sıkıldın mı? Oyun oyna!</h2>
        <p className="text-white/70 text-xs mb-4">Engellerden zıplayarak kaçın! Hız zamanla artar!</p>
        
        {!gameStarted ? (
          <button
            onClick={startGame}
            className="bg-white hover:bg-white/90 text-black font-semibold py-1.5 px-3 rounded-sm transition-colors text-xs"
            style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
          >
            Oyunu Başlat
          </button>
      ) : (
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
                className="w-5 h-5 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors"
                title="Oyunu Kapat"
              >
                ×
              </button>
            </div>
          </div>
          
          <div 
            className="relative bg-black rounded-lg overflow-hidden cursor-pointer w-full aspect-video max-h-24"
            onClick={handleMouseClick}
            onTouchStart={handleTouchStart}
            tabIndex={0}
          >
            {/* Game Over Overlay */}
            {gameOver && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10">
                <div className="text-white text-sm mb-4">Toplam Puan: {score}</div>
              </div>
            )}
            
            {/* Main ground line */}
            <div className="absolute bottom-0 w-full h-1 bg-white"></div>
            
            {/* Moving dotted road lines */}
            {roadLines.map((line) => (
              <div
                key={line.id}
                className="absolute bottom-2 w-1 h-0.5 bg-white/20 rounded-full"
                style={{ left: `${line.position}%` }}
              />
            ))}
            
            {/* Player/Character with jumping animation */}
            <motion.div
              className="absolute bottom-1 w-6 h-6 bg-white rounded-full"
              style={{ left: `${40}%` }} // Fixed center position
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
            
            {/* Dynamic Building Obstacle */}
            <div 
              className={`absolute bottom-1 bg-white`}
              style={{ 
                left: `${obstaclePosition}%`,
                width: `${currentObstacle.width}%`,
                height: `${currentObstacle.height}%`,
                borderRadius: currentObstacle.shape.includes('oval') ? '50%' : 
                              currentObstacle.shape.includes('circle') ? '50%' :
                              currentObstacle.shape.includes('arch') ? '50% 50% 0 0' :
                              currentObstacle.shape.includes('dome') ? '50% 50% 0 0' : 
                              currentObstacle.shape.includes('rounded') ? '20%' :
                              currentObstacle.shape.includes('sharp') ? '0%' : '8%',
                clipPath: 
                  // Original shapes
                  currentObstacle.shape.includes('triangle') ? 'polygon(50% 0%, 0% 100%, 100% 100%)' :
                  currentObstacle.shape.includes('pentagon') ? 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' :
                  currentObstacle.shape.includes('diamond') ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' :
                  currentObstacle.shape.includes('hexagon') ? 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' :
                  currentObstacle.shape.includes('star') ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' :
                  currentObstacle.shape.includes('spike') ? 'polygon(50% 0%, 0% 100%, 100% 100%)' :
                  currentObstacle.shape.includes('chevron') ? 'polygon(0% 100%, 50% 0%, 100% 100%)' :
                  currentObstacle.shape.includes('trapezoid') ? 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' :
                  currentObstacle.shape.includes('cross') ? 'polygon(40% 0%, 60% 0%, 60% 40%, 100% 40%, 100% 60%, 60% 60%, 60% 100%, 40% 100%, 40% 60%, 0% 60%, 0% 40%, 40% 40%)' :
                  currentObstacle.shape.includes('arrow') ? 'polygon(0% 50%, 40% 0%, 40% 30%, 100% 30%, 100% 70%, 40% 70%, 40% 100%)' :
                  currentObstacle.shape.includes('heart') ? 'polygon(50% 0%, 100% 35%, 82% 35%, 65% 15%, 50% 30%, 35% 15%, 18% 35%, 0% 35%, 50% 100%)' :
                  currentObstacle.shape.includes('lightning') ? 'polygon(50% 0%, 60% 40%, 100% 40%, 70% 50%, 90% 100%, 50% 60%, 10% 100%, 30% 50%, 0% 40%, 40% 40%)' :
                  // New shapes - Nature
                  currentObstacle.shape.includes('crescent') ? 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' :
                  currentObstacle.shape.includes('moon') ? 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' :
                  currentObstacle.shape.includes('sun') ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' :
                  currentObstacle.shape.includes('cloud') ? 'polygon(20% 50%, 30% 20%, 50% 10%, 70% 20%, 80% 50%, 70% 80%, 50% 90%, 30% 80%)' :
                  currentObstacle.shape.includes('wave') ? 'polygon(0% 50%, 25% 20%, 50% 50%, 75% 80%, 100% 50%, 75% 20%, 50% 50%, 25% 80%)' :
                  currentObstacle.shape.includes('mountain') ? 'polygon(50% 0%, 0% 100%, 100% 100%)' :
                  currentObstacle.shape.includes('volcano') ? 'polygon(50% 0%, 30% 40%, 0% 100%, 100% 100%, 70% 40%)' :
                  currentObstacle.shape.includes('tree') ? 'polygon(50% 0%, 40% 30%, 35% 60%, 30% 100%, 70% 100%, 65% 60%, 60% 30%)' :
                  currentObstacle.shape.includes('flower') ? 'polygon(50% 0%, 61% 25%, 98% 25%, 68% 50%, 79% 75%, 50% 60%, 21% 75%, 32% 50%, 2% 25%, 39% 25%)' :
                  currentObstacle.shape.includes('leaf') ? 'polygon(50% 0%, 75% 25%, 100% 50%, 75% 75%, 50% 100%, 25% 75%, 0% 50%, 25% 25%)' :
                  currentObstacle.shape.includes('feather') ? 'polygon(50% 0%, 60% 30%, 70% 50%, 60% 70%, 50% 100%, 40% 70%, 30% 50%, 40% 30%)' :
                  currentObstacle.shape.includes('wing') ? 'polygon(0% 50%, 50% 0%, 100% 50%, 50% 100%)' :
                  // Objects
                  currentObstacle.shape.includes('helmet') ? 'polygon(20% 0%, 80% 0%, 100% 30%, 100% 70%, 80% 100%, 20% 100%, 0% 70%, 0% 30%)' :
                  currentObstacle.shape.includes('shield') ? 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' :
                  currentObstacle.shape.includes('sword') ? 'polygon(45% 0%, 55% 0%, 60% 100%, 40% 100%)' :
                  currentObstacle.shape.includes('crown') ? 'polygon(50% 0%, 60% 30%, 80% 30%, 90% 60%, 100% 100%, 0% 100%, 10% 60%, 20% 30%, 40% 30%)' :
                  currentObstacle.shape.includes('key') ? 'polygon(30% 0%, 70% 0%, 70% 40%, 100% 40%, 100% 60%, 70% 60%, 70% 100%, 30% 100%, 30% 60%, 0% 60%, 0% 40%, 30% 40%)' :
                  currentObstacle.shape.includes('lock') ? 'polygon(20% 0%, 80% 0%, 80% 40%, 100% 40%, 100% 60%, 80% 60%, 80% 100%, 20% 100%, 20% 60%, 0% 60%, 0% 40%, 20% 40%)' :
                  currentObstacle.shape.includes('gear') ? 'polygon(50% 0%, 61% 20%, 80% 20%, 90% 50%, 80% 80%, 61% 80%, 50% 100%, 39% 80%, 20% 80%, 10% 50%, 20% 20%, 39% 20%)' :
                  currentObstacle.shape.includes('wheel') ? 'polygon(50% 0%, 61% 25%, 98% 25%, 68% 50%, 98% 75%, 61% 75%, 50% 100%, 39% 75%, 2% 75%, 32% 50%, 2% 25%, 39% 25%)' :
                  // Geometric
                  currentObstacle.shape.includes('cube') ? 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' :
                  currentObstacle.shape.includes('sphere') ? 'polygon(50% 0%, 61% 20%, 80% 30%, 90% 50%, 80% 70%, 61% 80%, 50% 100%, 39% 80%, 20% 70%, 10% 50%, 20% 30%, 39% 20%)' :
                  currentObstacle.shape.includes('cylinder') ? 'polygon(30% 0%, 70% 0%, 70% 80%, 30% 80%)' :
                  currentObstacle.shape.includes('cone') ? 'polygon(50% 0%, 100% 100%, 0% 100%)' :
                  currentObstacle.shape.includes('prism') ? 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)' :
                  currentObstacle.shape.includes('crystal') ? 'polygon(50% 0%, 60% 30%, 80% 50%, 60% 70%, 50% 100%, 40% 70%, 20% 50%, 40% 30%)' :
                  currentObstacle.shape.includes('gem') ? 'polygon(50% 0%, 61% 25%, 90% 40%, 75% 75%, 50% 100%, 25% 75%, 10% 40%, 39% 25%)' :
                  // Elements
                  currentObstacle.shape.includes('fire') ? 'polygon(50% 0%, 61% 30%, 70% 40%, 80% 60%, 70% 80%, 50% 100%, 30% 80%, 20% 60%, 30% 40%, 39% 30%)' :
                  currentObstacle.shape.includes('flame') ? 'polygon(50% 0%, 60% 20%, 70% 30%, 60% 50%, 70% 70%, 50% 100%, 30% 70%, 40% 50%, 30% 30%, 40% 20%)' :
                  currentObstacle.shape.includes('ice') ? 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' :
                  currentObstacle.shape.includes('snowflake') ? 'polygon(50% 0%, 61% 25%, 75% 25%, 75% 50%, 100% 50%, 75% 50%, 75% 75%, 61% 75%, 50% 100%, 39% 75%, 25% 75%, 25% 50%, 0% 50%, 25% 50%, 25% 25%, 39% 25%)' :
                  currentObstacle.shape.includes('rainbow') ? 'polygon(0% 80%, 100% 80%, 100% 100%, 0% 100%)' :
                  currentObstacle.shape.includes('spiral') ? 'polygon(50% 0%, 61% 20%, 80% 30%, 70% 50%, 80% 70%, 61% 80%, 50% 100%, 39% 80%, 20% 70%, 30% 50%, 20% 30%, 39% 20%)' :
                  currentObstacle.shape.includes('infinity') ? 'polygon(20% 50%, 30% 20%, 50% 20%, 70% 50%, 50% 80%, 30% 80%)' :
                  // Default to rectangle for all other shapes
                  'none',
                transform: currentObstacle.shape.includes('rotated') ? 'rotate(45deg)' : 'none'
              }}
            />
          </div>
          
          <div className="flex gap-2 justify-center">
            {gameOver && (
              <button
                onClick={startGame}
                className="bg-white hover:bg-white/90 text-black font-semibold py-1.5 px-3 rounded-lg transition-colors text-xs"
                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
              >
                Tekrar Oyna
              </button>
            )}
          </div>
          
          {/* Controls outside game area */}
          <div className="mt-2 text-center">
            <p className="text-white/55 text-xs font-medium">Zıpla</p>
            <p className="text-xs text-white/50">Mobil: Ekrana dokun | Klavye: Boşluk/W/↑</p>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
