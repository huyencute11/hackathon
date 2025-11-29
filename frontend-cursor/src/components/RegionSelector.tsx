import { useState, useEffect } from 'react';
import { Modal, List, Checkbox, Spin, Empty, Input, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';
import type { Region } from '../types';

const { Search } = Input;

interface RegionSelectorProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (selectedIds: number[]) => void;
  initialSelected?: number[];
}

export const RegionSelector: React.FC<RegionSelectorProps> = ({
  open,
  onClose,
  onConfirm,
  initialSelected = [],
}) => {
  const { t } = useTranslation();
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>(initialSelected);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (open) {
      fetchRegions();
      setSelectedIds(initialSelected);
    }
  }, [open, initialSelected]);

  const fetchRegions = async () => {
    try {
      setLoading(true);
      const data = await apiService.getRegions();
      setRegions(data);
    } catch (error: any) {
      console.error('Error fetching regions:', error);
      // Show error message to user
      if (error.response) {
        console.error('API Error:', error.response.status, error.response.data);
      } else if (error.request) {
        console.error('Network Error: No response from server');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (regionId: number) => {
    setSelectedIds((prev) =>
      prev.includes(regionId)
        ? prev.filter((id) => id !== regionId)
        : [...prev, regionId]
    );
  };

  const handleConfirm = () => {
    onConfirm(selectedIds);
    onClose();
  };

  const filteredRegions = regions.filter(
    (region) =>
      region.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      region.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal
      title={t('donation.selectRegionsTitle')}
      open={open}
      onCancel={onClose}
      onOk={handleConfirm}
      okText={t('donation.confirm')}
      cancelText={t('donation.cancel')}
      width={600}
    >
      <div className="mb-4">
        <Search
          placeholder={t('dashboard.searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Spin size="large" />
        </div>
      ) : filteredRegions.length === 0 ? (
        <Empty description={t('dashboard.noRegionsFound')} />
      ) : (
        <List
          dataSource={filteredRegions}
          renderItem={(region) => (
            <List.Item>
              <div className="w-full flex items-start gap-3">
                <Checkbox
                  checked={selectedIds.includes(region.id)}
                  onChange={() => handleToggle(region.id)}
                />
                <div className="flex-1">
                  <div className="font-semibold text-base mb-1">{region.name}</div>
                  <div className="text-sm text-gray-600">{region.description}</div>
                </div>
                {selectedIds.includes(region.id) && (
                  <Tag color="blue">{t('common.selected')}</Tag>
                )}
              </div>
            </List.Item>
          )}
        />
      )}

      {selectedIds.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded">
          <strong>{t('donation.selectedRegions', { count: selectedIds.length })}</strong>
        </div>
      )}
    </Modal>
  );
};
