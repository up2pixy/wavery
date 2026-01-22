import WavesIcon from '@mui/icons-material/Waves';
import { AppBar, Box, Container, Paper, Toolbar, Typography } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { WaveryOptions } from '../lib/src/types';
import { defaultOptions } from '../lib/src/wavery';
import ControlPanel from './components/ControlPanel';
import WaveryCanvas from './components/WaveryCanvas';

const App: React.FC = () => {
  const [options, setOptions] = useState<WaveryOptions>(defaultOptions);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const handleOptionsChange = useCallback((newOptions: Partial<WaveryOptions>) => {
    setOptions(prev => ({ ...prev, ...newOptions }));
  }, []);

  const handleRegenerate = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  const handleReset = useCallback(() => {
    setOptions(defaultOptions);
    setRefreshKey(prev => prev + 1);
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Title Bar */}
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <WavesIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
            Wavery Generator
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Create beautiful wave backgrounds
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ flexGrow: 1, py: 3, display: 'flex', gap: 3 }}>
        {/* Canvas Section */}
        <Paper 
          elevation={3} 
          sx={{ 
            flex: 2, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            p: 2,
            bgcolor: '#fafafa',
            overflow: 'hidden'
          }}
        >
          <WaveryCanvas options={options} refreshKey={refreshKey} />
        </Paper>

        {/* Control Panel */}
        <Paper 
          elevation={3} 
          sx={{ 
            flex: 1, 
            minWidth: 320,
            maxWidth: 400,
            overflow: 'auto'
          }}
        >
          <ControlPanel 
            options={options} 
            onOptionsChange={handleOptionsChange}
            onRegenerate={handleRegenerate}
            onReset={handleReset}
          />
        </Paper>
      </Container>
    </Box>
  );
};

export default App;
