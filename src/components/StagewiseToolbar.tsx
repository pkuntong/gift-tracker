import { useEffect } from 'react';
import { StagewiseToolbar as Toolbar } from '@stagewise/toolbar-react';
import { createRoot } from 'react-dom/client';

const stagewiseConfig = {
  plugins: [],
  style: {
    width: '300px',
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 1000,
    transform: 'scale(0.8)',
    transformOrigin: 'bottom right'
  }
};

export function StagewiseToolbar() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const container = document.createElement('div');
      container.id = 'stagewise-toolbar-root';
      document.body.appendChild(container);
      
      const root = createRoot(container);
      root.render(<Toolbar config={stagewiseConfig} />);

      return () => {
        root.unmount();
        container.remove();
      };
    }
  }, []);

  return null;
} 