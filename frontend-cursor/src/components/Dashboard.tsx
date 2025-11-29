import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Row, Col, Spin, Alert, Typography, Input, Empty } from 'antd';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { RegionCard } from './RegionCard';
import { LanguageSwitcher } from './LanguageSwitcher';
import { apiService } from '../services/api';
import type { SuggestionResponse } from '../types';

const { Title } = Typography;
const { Search } = Input;

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [regions, setRegions] = useState<SuggestionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchRegions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getAllRegionsWithSuggestions();
      setRegions(data);
    } catch (err) {
      setError(t('dashboard.errorLoading'));
      console.error('Error fetching regions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  const filteredRegions = regions.filter((item) =>
    item.region.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.region.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" tip={t('dashboard.loadingData')} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert
          message={t('common.error')}
          description={error}
          type="error"
          showIcon
          action={
            <button
              onClick={fetchRegions}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {t('common.retry')}
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <Title level={2} className="mb-0">
              {t('dashboard.title')}
            </Title>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <button
                onClick={fetchRegions}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                <ReloadOutlined />
                {t('common.refresh')}
              </button>
            </div>
          </div>
          <Search
            placeholder={t('dashboard.searchPlaceholder')}
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {filteredRegions.length === 0 ? (
          <Empty description={t('dashboard.noRegionsFound')} />
        ) : (
          <Row gutter={[16, 16]}>
            {filteredRegions.map((item) => (
              <Col xs={24} sm={12} lg={8} key={item.region.id}>
                <RegionCard
                  region={{
                    ...item.region,
                    tags: item.region.tags || [],
                    items: item.suggested_items || [],
                    providers: item.recommended_providers || [],
                  }}
                  onViewDetail={(regionId) => navigate(`/region/${regionId}`)}
                />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};

