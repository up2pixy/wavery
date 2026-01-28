import DownloadIcon from '@mui/icons-material/Download';
import { Box, IconButton, Tooltip } from '@mui/material';
import React, { useEffect, useMemo, useRef } from 'react';
import { createWavery, createWaveryDataURL, WaveryOptions } from '../../lib/src/wavery';

interface WaveryCanvasProps {
  options: WaveryOptions;
  refreshKey: number;
}

const WaveryCanvas: React.FC<WaveryCanvasProps> = ({ options, refreshKey }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const svgElement = useMemo(() => {
    return createWavery(options);
  }, [options, refreshKey]);

  useEffect(() => {
    const container = containerRef.current;
    if (container && svgElement) {
      // Clear previous content
      container.innerHTML = '';
      // Append the new SVG
      container.appendChild(svgElement);
    }
  }, [svgElement]);

  const handleDownloadSVG = () => {
    const dataURL = createWaveryDataURL(options);
    const link = document.createElement('a');
    link.download = 'wavery-background.svg';
    link.href = dataURL;
    link.click();
  };

  const handleDownloadPNG = () => {
    const canvas = document.createElement('canvas');
    canvas.width = options.width;
    canvas.height = options.height;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      const img = new Image();
      const dataURL = createWaveryDataURL(options);
      
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        const pngURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'wavery-background.png';
        link.href = pngURL;
        link.click();
      };
      
      img.src = dataURL;
    }
  };

  return (
    <Box sx={{ position: 'relative', display: 'inline-block' }}>
      <Box
        ref={containerRef}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '& svg': {
            maxWidth: '100%',
            maxHeight: 'calc(100vh - 200px)',
            height: 'auto',
            borderRadius: 1,
            boxShadow: 2,
          }
        }}
      />
      <Box sx={{ 
        position: 'absolute', 
        top: 8, 
        right: 8, 
        display: 'flex', 
        gap: 0.5,
        bgcolor: 'rgba(255,255,255,0.9)',
        borderRadius: 1,
        p: 0.5
      }}>
        <Tooltip title="Download as SVG">
          <IconButton size="small" onClick={handleDownloadSVG} color="primary">
            <DownloadIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Download as PNG">
          <IconButton size="small" onClick={handleDownloadPNG} color="secondary">
            <DownloadIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default WaveryCanvas;
