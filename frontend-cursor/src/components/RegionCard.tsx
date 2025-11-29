import { Card, Tag, Badge, Button, Space } from 'antd';
import { EnvironmentOutlined, FireOutlined, RobotOutlined, EyeOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { RegionDetail } from '../types';

interface RegionCardProps {
  region: RegionDetail;
  onViewDetail?: (regionId: number) => void;
  onAIDonate?: (regionId: number) => void;
}

export const RegionCard: React.FC<RegionCardProps> = ({ region, onViewDetail, onAIDonate }) => {
  const { t } = useTranslation();
  const topPriorityItems = region.items
    .sort((a, b) => b.priority_score - a.priority_score)
    .slice(0, 3);

  const getPriorityColor = (score: number) => {
    if (score >= 0.8) return 'red';
    if (score >= 0.6) return 'orange';
    if (score >= 0.4) return 'yellow';
    return 'blue';
  };

  return (
    <Card
      className="h-full shadow-md hover:shadow-lg transition-shadow overflow-hidden"
      cover={
        region.image_url && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={region.image_url}
              alt={region.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        )
      }
      title={
        <div className="flex items-center gap-2">
          <EnvironmentOutlined className="text-blue-500" />
          <span className="font-semibold text-lg">{region.name}</span>
        </div>
      }
      extra={
        <Button type="link" onClick={() => onViewDetail?.(region.id)} icon={<EyeOutlined />}>
          {t('common.detail')}
        </Button>
      }
    >
      <div className="space-y-4">
        <p className="text-gray-600 text-sm line-clamp-2">{region.description}</p>

        {/* Tags */}
        <div>
          <div className="text-xs text-gray-500 mb-2">{t('region.needs')}</div>
          <div className="flex flex-wrap gap-2">
            {region.tags?.map((tag) => (
              <Tag key={tag.id} color="blue">
                {tag.name}
              </Tag>
            ))}
          </div>
        </div>

        {/* Top Priority Items */}
        {topPriorityItems.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FireOutlined className="text-orange-500" />
              <span className="text-xs font-semibold text-gray-700">{t('region.priorityItems')}</span>
            </div>
            <div className="space-y-2">
              {topPriorityItems.map((regionItem) => (
                <div
                  key={regionItem.item_id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <span className="text-sm">{regionItem.item?.name || 'N/A'}</span>
                  <Badge
                    count={`${Math.round(regionItem.priority_score * 100)}%`}
                    style={{ backgroundColor: getPriorityColor(regionItem.priority_score) }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Provider Count */}
        {region.providers && region.providers.length > 0 && (
          <div className="text-xs text-gray-500">
            {t('region.providersAvailable', { count: region.providers.length })}
          </div>
        )}

        {/* AI Donate Button */}
        <div className="pt-2 mt-4 border-t">
          <Space size="small" style={{ width: '100%', justifyContent: 'space-between' }}>
            <Button 
              type="default" 
              icon={<EyeOutlined />}
              onClick={() => onViewDetail?.(region.id)}
              size="small"
            >
              Chi tiết
            </Button>
            <Button
              type="primary"
              icon={<RobotOutlined />}
              onClick={() => onAIDonate?.(region.id)}
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none'
              }}
              size="small"
            >
              AI Gợi ý
            </Button>
          </Space>
        </div>
      </div>
    </Card>
  );
};

