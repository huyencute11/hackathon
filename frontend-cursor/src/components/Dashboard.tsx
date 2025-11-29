import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Row, Col, Spin, Alert, Typography, Input, Empty, message } from 'antd';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { RegionCard } from './RegionCard';
import { Navbar } from './Navbar';
import { RegionSelector } from './RegionSelector';
import { ProductSelector } from './ProductSelector';
import { DonationResult } from './DonationResult';
import { AIDonationModal } from './AIDonationModal';
import { apiService } from '../services/api';
import type { SuggestionResponse, DonationLocation, AIDonationResponse } from '../types';

const { Title } = Typography;
const { Search } = Input;

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [regions, setRegions] = useState<SuggestionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Donation states
  const [selectedRegionIds, setSelectedRegionIds] = useState<number[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [regionSelectorOpen, setRegionSelectorOpen] = useState(false);
  const [productSelectorOpen, setProductSelectorOpen] = useState(false);
  const [donationResultOpen, setDonationResultOpen] = useState(false);
  const [donationLocations, setDonationLocations] = useState<DonationLocation[]>([]);
  const [submittingDonation, setSubmittingDonation] = useState(false);

  // AI Donation states  
  const [aiDonationModalOpen, setAiDonationModalOpen] = useState(false);
  const [aiDonationResponse, setAiDonationResponse] = useState<AIDonationResponse | null>(null);
  const [aiDonationLoading, setAiDonationLoading] = useState(false);

  // Geolocation state
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

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
    requestGeolocation();
  }, []);

  // Request user's geolocation
  const requestGeolocation = () => {
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationPermission('granted');
        message.success(t('geolocation.enabled'));
      },
      (error) => {
        console.error('Error getting location:', error);
        setLocationPermission('denied');
        if (error.code === error.PERMISSION_DENIED) {
          message.info(t('geolocation.deniedInfo'));
        }
      }
    );
  };

  const filteredRegions = regions.filter((item) =>
    item.region.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.region.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectRegions = (ids: number[]) => {
    setSelectedRegionIds(ids);
  };

  const handleSelectProducts = (ids: number[]) => {
    setSelectedProductIds(ids);
  };

  const handleDonate = async () => {
    // Allow submission even with empty selections (backend will handle)
    setSubmittingDonation(true);
    try {
      const response = await apiService.submitDonation({
        region_ids: selectedRegionIds,
        product_ids: selectedProductIds,
      });
      setDonationLocations(response.locations);
      setDonationResultOpen(true);
      message.success(t('donation.success'));
    } catch (err) {
      message.error(t('common.error'));
      console.error('Error submitting donation:', err);
    } finally {
      setSubmittingDonation(false);
    }
  };

  // AI-powered donation handler
  const handleAIDonation = async (regionId: number) => {
    setAiDonationModalOpen(true);
    setAiDonationLoading(true);
    setAiDonationResponse(null);
    
    try {
      const response = await apiService.submitAIDonation({
        region_id: regionId,
        item_ids: [], // Can be extended later
        user_latitude: userLocation?.latitude,
        user_longitude: userLocation?.longitude,
      });
      setAiDonationResponse(response);
      message.success('AI đã phân tích và đưa ra gợi ý!');
    } catch (err) {
      message.error('Lỗi khi gọi AI. Vui lòng thử lại.');
      console.error('Error calling AI donation:', err);
      setAiDonationModalOpen(false);
    } finally {
      setAiDonationLoading(false);
    }
  };

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
      {/* Navbar */}
      <Navbar
        onSelectRegion={() => setRegionSelectorOpen(true)}
        onSelectProduct={() => setProductSelectorOpen(true)}
        onDonate={handleDonate}
        selectedRegionsCount={selectedRegionIds.length}
        selectedProductsCount={selectedProductIds.length}
        isSubmitting={submittingDonation}
      />

      {/* Header with Search */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <Title level={2} className="mb-0">
              {t('dashboard.title')}
            </Title>
            <button
              onClick={fetchRegions}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              <ReloadOutlined />
              {t('common.refresh')}
            </button>
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
                  onAIDonate={handleAIDonation}
                />
              </Col>
            ))}
          </Row>
        )}
      </div>

      {/* Modals */}
      <RegionSelector
        open={regionSelectorOpen}
        onClose={() => setRegionSelectorOpen(false)}
        onConfirm={handleSelectRegions}
        initialSelected={selectedRegionIds}
      />

      <ProductSelector
        open={productSelectorOpen}
        onClose={() => setProductSelectorOpen(false)}
        onConfirm={handleSelectProducts}
        initialSelected={selectedProductIds}
      />

      <DonationResult
        open={donationResultOpen}
        onClose={() => setDonationResultOpen(false)}
        locations={donationLocations}
      />

      {/* AI Donation Modal */}
      <AIDonationModal
        visible={aiDonationModalOpen}
        onClose={() => setAiDonationModalOpen(false)}
        response={aiDonationResponse}
        loading={aiDonationLoading}
      />
    </div>
  );
};

