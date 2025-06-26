import React from "react";
import { Box } from "@mui/material";

const BOMB_IMAGE = "https://brainrothub.com/brainrot-main/characters/Bombardiro-Crocodilo--1.webp";
const BOMB_SOUND = "https://www.myinstants.com/media/sounds/bombardino-crocodilo_MSpHN9M.mp3";

const BombardilloCrocodilo: React.FC = () => {
  React.useEffect(() => {
    const audio = new Audio(BOMB_SOUND);
    audio.volume = 0.7;
    audio.play().catch(() => {});
  }, []);
  const bombs = [0, 1, 2].map((i) => (
    <Box
      key={i}
      sx={{
        position: 'absolute',
        left: '65%',
        bottom: '-64px',
        transform: 'translateX(-65%)',
        width: { xs: 96, md: 136 },
        height: { xs: 96, md: 136 },
        zIndex: 1201,
        pointerEvents: 'none',
        overflow: 'hidden',
        borderRadius: '50%',
        background: 'transparent',
        animation: `bomb-drop 2.2s ${i * 0.8}s linear infinite`,
        '@keyframes bomb-drop': {
          '0%': { opacity: 0, transform: 'translateY(0) scale(0.7)' },
          '10%': { opacity: 1, transform: 'translateY(0) scale(1)' },
          '80%': { opacity: 1, transform: 'translateY(120px) scale(1.1)' },
          '100%': { opacity: 0, transform: 'translateY(180px) scale(0.7)' },
        },
      }}
    >
      <img
        src={BOMB_IMAGE}
        alt="bomb"
        style={{
          width: '100%',
          height: '36%',
          objectFit: 'cover',
          objectPosition: '50% 92%',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
        draggable={false}
      />
    </Box>
  ));

  return (
    <Box
      sx={{
        position: 'fixed',
        top: { xs: 60, md: 40 },
        left: '-200px',
        zIndex: 1200,
        pointerEvents: 'none',
        width: { xs: 120, md: 180 },
        height: 'auto',
        animation: 'bombardillo-fly-bounce 12s linear infinite',
        '@keyframes bombardillo-fly-bounce': {
          '0%':   { left: '-200px', opacity: 0, transform: 'rotate(-8deg) scaleX(-1)' },
          '5%':   { left: '-200px', opacity: 1, transform: 'rotate(-8deg) scaleX(-1)' },
          '45%':  { left: 'calc(100vw - 120px)', opacity: 1, transform: 'rotate(6deg) scaleX(-1)' },
          '50%':  { left: 'calc(100vw + 200px)', opacity: 0, transform: 'rotate(6deg) scaleX(-1)' },
          '51%':  { left: 'calc(100vw + 200px)', opacity: 0, transform: 'rotate(6deg) scaleX(1)' },
          '55%':  { left: 'calc(100vw + 200px)', opacity: 1, transform: 'rotate(6deg) scaleX(1)' },
          '95%':  { left: '-200px', opacity: 1, transform: 'rotate(-8deg) scaleX(1)' },
          '100%': { left: '-200px', opacity: 0, transform: 'rotate(-8deg) scaleX(1)' },
        },
      }}
    >
      <img
        src={BOMB_IMAGE}
        alt="Bombardillo Crocodilo"
        style={{ width: '100%', height: 'auto', userSelect: 'none', pointerEvents: 'none' }}
        draggable={false}
      />
      {bombs}
    </Box>
  );
};

export default BombardilloCrocodilo;
