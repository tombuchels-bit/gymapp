import React from 'react'; import { createRoot } from 'react-dom/client'; import App from './ui/App'; import './style.css'; import './ui/features.css';
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
