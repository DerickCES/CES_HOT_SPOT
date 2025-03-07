import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GISMain from './sections/viewer/GISMain.jsx';
import LoginGIS from './sections/QGISHeatseek/LoginGIS.jsx';
import GISMainHeat from './sections/QGISHeatseek/GISMainHeat.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>

      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/GISMain" element={<GISMain />} />
          <Route path="/LoginGIS" element={<LoginGIS />} />
          <Route path="/GISMainHeat" element={<GISMainHeat />} />
        </Routes>
      </Router>   
  </React.StrictMode>
);
