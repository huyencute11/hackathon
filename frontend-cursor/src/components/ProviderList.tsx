import { List, Tag, Typography } from 'antd';
import { ShopOutlined, EnvironmentOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { ProviderRegion } from '../types';

const { Text } = Typography;

interface ProviderListProps {
  providers: ProviderRegion[];
  title?: string;
}

export const ProviderList: React.FC<ProviderListProps> = ({ providers, title }) => {
  const { t } = useTranslation();
  const displayTitle = title || t('providers.title');
  
  // Sort by user distance if available, otherwise by provider-region distance
  const sortedProviders = [...providers].sort((a, b) => {
    const distA = a.provider?.distance ?? a.distance ?? Infinity;
    const distB = b.provider?.distance ?? b.distance ?? Infinity;
    return distA - distB;
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center gap-2 mb-4">
        <ShopOutlined className="text-green-500 text-lg" />
        <h3 className="text-lg font-semibold">{displayTitle}</h3>
      </div>
      <List
        dataSource={sortedProviders}
        renderItem={(providerRegion) => {
          const userDistance = providerRegion.provider?.distance;
          const hasUserDistance = userDistance !== undefined && userDistance !== null;
          
          return (
            <List.Item className="hover:bg-gray-50 rounded p-3">
              <div className="w-full">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Text strong className="text-base">
                        {providerRegion.provider?.name || 'N/A'}
                      </Text>
                      {hasUserDistance && userDistance < 10 && (
                        <Tag color="green">Gần bạn</Tag>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                      <EnvironmentOutlined />
                      <span>{providerRegion.provider?.location || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    {hasUserDistance && (
                      <Tag color="blue" className="mb-2">
                        📍 {userDistance.toFixed(1)} km
                      </Tag>
                    )}
                    <Tag color="green">
                      {t('providers.capacity')}: {providerRegion.provider?.capacity || 0}
                    </Tag>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <div className="flex items-center gap-1 text-gray-600">
                    <ClockCircleOutlined />
                    <span>{providerRegion.shipping_estimate}</span>
                  </div>
                </div>
              </div>
            </List.Item>
          );
        }}
      />
    </div>
  );
};

