import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Spin, Alert, Button, Row, Col, Typography, Card } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { ItemList } from '../components/ItemList';
import { ProviderList } from '../components/ProviderList';
import { apiService } from '../services/api';
import type { SuggestionResponse } from '../types';

const { Title, Paragraph } = Typography;

export const RegionDetail: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<SuggestionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Request geolocation on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.getSuggestions(
          Number(id),
          userLocation?.latitude,
          userLocation?.longitude
        );
        setData(response);
      } catch (err) {
        setError(t('regionDetail.errorLoading'));
        console.error('Error fetching region detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, userLocation]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" tip={t('dashboard.loadingData')} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6">
        <Alert
          message={t('common.error')}
          description={error || t('regionDetail.notFound')}
          type="error"
          showIcon
          action={
            <Button onClick={() => navigate('/')}>{t('common.back')}</Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/')}
          className="mb-4"
        >
          {t('common.back')}
        </Button>

        <Card className="mb-6">
          <Title level={2}>{data.region.name}</Title>
          <Paragraph className="text-gray-600">{data.region.description}</Paragraph>
        </Card>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={14}>
            <ItemList
              items={data.suggested_items || []}
              title={t('items.suggestedTitle')}
            />
          </Col>
          <Col xs={24} lg={10}>
            <ProviderList
              providers={data.recommended_providers || []}
              title={t('providers.recommendedTitle')}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

