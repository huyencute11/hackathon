import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import enUS from 'antd/locale/en_US';
import { useTranslation } from 'react-i18next';
import { Dashboard } from './components/Dashboard';
import { RegionDetail } from './pages/RegionDetail';
import './App.css';

function AppContent() {
  const { i18n } = useTranslation();
  const antdLocale = i18n.language === 'en' ? enUS : viVN;

  return (
    <ConfigProvider locale={antdLocale}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/region/:id" element={<RegionDetail />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

function App() {
  return <AppContent />;
}

export default App;

