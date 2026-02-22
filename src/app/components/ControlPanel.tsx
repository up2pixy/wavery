import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RefreshIcon from '@mui/icons-material/Refresh';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  IconButton,
  Slider,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { WaveryOptions } from '../../lib/src/wavery';
import { colorPresets } from '../presets';

interface ControlPanelProps {
  options: WaveryOptions;
  onOptionsChange: (options: Partial<WaveryOptions>) => void;
  onRegenerate: () => void;
  onReset: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  options,
  onOptionsChange,
  onRegenerate,
  onReset,
}) => {
  const [expanded, setExpanded] = useState<string | false>('dimensions');

  const handleAccordionChange = (panel: string) => (
    _event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleColorChange = (index: number, colorValue: string) => {
    const newColors = [...options.gradientColors];
    newColors[index] = { ...newColors[index], colorValue };
    onOptionsChange({ gradientColors: newColors });
  };

  const handleColorPositionChange = (index: number, position: number) => {
    const newColors = [...options.gradientColors];
    newColors[index] = { ...newColors[index], position };
    onOptionsChange({ gradientColors: newColors });
  };

  const addColor = () => {
    const newColors = [
      ...options.gradientColors,
      { colorValue: '#4caf50', position: 1 },
    ];
    // Recalculate positions
    newColors.forEach((color, idx) => {
      color.position = idx / (newColors.length - 1);
    });
    onOptionsChange({ gradientColors: newColors });
  };

  const removeColor = (index: number) => {
    if (options.gradientColors.length <= 2) return;
    const newColors = options.gradientColors.filter((_, i) => i !== index);
    // Recalculate positions
    newColors.forEach((color, idx) => {
      color.position = idx / (newColors.length - 1);
    });
    onOptionsChange({ gradientColors: newColors });
  };

  const applyPreset = (presetIndex: number) => {
    const preset = colorPresets[presetIndex];
    if (preset) {
      onOptionsChange({ gradientColors: [...preset.colors] });
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Options
      </Typography>

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={onRegenerate}
          fullWidth
        >
          Regenerate
        </Button>
        <Tooltip title="Reset to defaults">
          <Button
            variant="outlined"
            onClick={onReset}
            sx={{ minWidth: 'auto', px: 2 }}
          >
            <RestartAltIcon />
          </Button>
        </Tooltip>
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* Dimensions */}
      <Accordion
        expanded={expanded === 'dimensions'}
        onChange={handleAccordionChange('dimensions')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Dimensions</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Width"
              type="number"
              size="small"
              value={options.width}
              onChange={(e) => onOptionsChange({ width: parseInt(e.target.value) || 800 })}
              inputProps={{ min: 100, max: 4000 }}
              fullWidth
            />
            <TextField
              label="Height"
              type="number"
              size="small"
              value={options.height}
              onChange={(e) => onOptionsChange({ height: parseInt(e.target.value) || 600 })}
              inputProps={{ min: 100, max: 4000 }}
              fullWidth
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Wave Settings */}
      <Accordion
        expanded={expanded === 'waves'}
        onChange={handleAccordionChange('waves')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Wave Settings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom>
              Segment Count: {options.segmentCount}
            </Typography>
            <Slider
              value={options.segmentCount}
              onChange={(_, value) => onOptionsChange({ segmentCount: value as number })}
              min={5}
              max={50}
              step={1}
              valueLabelDisplay="auto"
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom>
              Layer Count: {options.layerCount}
            </Typography>
            <Slider
              value={options.layerCount}
              onChange={(_, value) => onOptionsChange({ layerCount: value as number })}
              min={3}
              max={30}
              step={1}
              valueLabelDisplay="auto"
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography gutterBottom>
              Variance: {options.variance.toFixed(2)}
            </Typography>
            <Slider
              value={options.variance}
              onChange={(_, value) => onOptionsChange({ variance: value as number })}
              min={0}
              max={2}
              step={0.05}
              valueLabelDisplay="auto"
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Stroke Settings */}
      <Accordion
        expanded={expanded === 'stroke'}
        onChange={handleAccordionChange('stroke')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Stroke Settings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom>
              Stroke Width: {options.strokeWidth}
            </Typography>
            <Slider
              value={options.strokeWidth}
              onChange={(_, value) => onOptionsChange({ strokeWidth: value as number })}
              min={0}
              max={10}
              step={0.5}
              valueLabelDisplay="auto"
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography>Stroke Color:</Typography>
            <input
              type="color"
              value={options.strokeColor === 'none' ? '#000000' : options.strokeColor}
              onChange={(e) => onOptionsChange({ strokeColor: e.target.value })}
              style={{ width: 50, height: 30, cursor: 'pointer', border: 'none' }}
            />
            <Button
              size="small"
              variant="outlined"
              onClick={() => onOptionsChange({ strokeColor: 'none' })}
            >
              None
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Gradient Colors */}
      <Accordion
        expanded={expanded === 'colors'}
        onChange={handleAccordionChange('colors')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Gradient Colors</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            {options.gradientColors.map((color, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  p: 1,
                  bgcolor: 'grey.100',
                  borderRadius: 1,
                }}
              >
                <input
                  type="color"
                  value={color.colorValue}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                  style={{ width: 40, height: 30, cursor: 'pointer', border: 'none' }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Position: {(color.position * 100).toFixed(0)}%
                  </Typography>
                  <Slider
                    value={color.position}
                    onChange={(_, value) => handleColorPositionChange(index, value as number)}
                    min={0}
                    max={1}
                    step={0.01}
                    size="small"
                  />
                </Box>
                <IconButton
                  size="small"
                  onClick={() => removeColor(index)}
                  disabled={options.gradientColors.length <= 2}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addColor}
              fullWidth
            >
              Add Color
            </Button>
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* Color Presets */}
      <Accordion
        expanded={expanded === 'presets'}
        onChange={handleAccordionChange('presets')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Color Presets</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={1.5}>
            {colorPresets.map((preset, index) => (
              <Box
                key={index}
                onClick={() => applyPreset(index)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 1.5,
                  bgcolor: 'grey.50',
                  borderRadius: 1,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: '1px solid',
                  borderColor: 'grey.300',
                  '&:hover': {
                    bgcolor: 'grey.200',
                    borderColor: 'primary.main',
                    boxShadow: 1,
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    gap: 0.5,
                    minWidth: 80,
                  }}
                >
                  {preset.colors.map((color, colorIndex) => (
                    <Box
                      key={colorIndex}
                      sx={{
                        width: 24,
                        height: 24,
                        bgcolor: color.colorValue,
                        borderRadius: 0.5,
                        border: '1px solid rgba(0,0,0,0.1)',
                      }}
                    />
                  ))}
                </Box>
                <Typography variant="body2" sx={{ flex: 1, fontWeight: 500 }}>
                  {preset.name}
                </Typography>
              </Box>
            ))}
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ControlPanel;
