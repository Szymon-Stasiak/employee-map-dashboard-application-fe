import { motion } from 'framer-motion';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

type AnimatedTextProps = {
  text: string;
};

const defaultAnimations = {
  wave: {
    y: [0, 2, 0, -2, 0],
  },
};

const spanStyle = {
  display: 'inline-block',
  padding: 0,
};

export const AnimatedText = ({ text }: AnimatedTextProps) => {
  const theme = useTheme();
  const gradientBackground = `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`;

  return (
    <Typography
      noWrap
      style={{
        fontSize: '40px',
        backgroundImage: gradientBackground,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: 'bold',
      }}
    >
      <motion.span aria-hidden animate="wave" transition={{ staggerChildren: 0.1 }}>
        {text.split('').map((char, index) => (
          <motion.span
            key={index}
            variants={defaultAnimations}
            transition={{ repeat: Infinity, repeatDelay: 10, ease: 'linear', duration: 1 }}
            style={spanStyle}
          >
            {char}
          </motion.span>
        ))}
      </motion.span>
    </Typography>
  );
};
