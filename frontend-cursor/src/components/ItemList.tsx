import { List, Badge, Progress, Typography } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { RegionItem } from '../types';

const { Text } = Typography;

interface ItemListProps {
  items: RegionItem[];
  title?: string;
}

export const ItemList: React.FC<ItemListProps> = ({ items, title }) => {
  const { t } = useTranslation();
  const displayTitle = title || t('items.title');
  const sortedItems = [...items].sort((a, b) => b.priority_score - a.priority_score);

  const getPriorityColor = (score: number) => {
    if (score >= 0.8) return '#ff4d4f';
    if (score >= 0.6) return '#ff9800';
    if (score >= 0.4) return '#faad14';
    return '#1890ff';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingOutlined className="text-blue-500 text-lg" />
        <h3 className="text-lg font-semibold">{displayTitle}</h3>
      </div>
      <List
        dataSource={sortedItems}
        renderItem={(regionItem) => (
          <List.Item className="hover:bg-gray-50 rounded p-3">
            <div className="w-full">
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1">
                  <Text strong className="text-base">
                    {regionItem.item?.name || 'N/A'}
                  </Text>
                  {regionItem.item?.description && (
                    <div className="text-sm text-gray-500 mt-1">
                      {regionItem.item.description}
                    </div>
                  )}
                  {regionItem.item?.category && (
                    <Badge
                      count={regionItem.item.category}
                      style={{ backgroundColor: '#52c41a', marginTop: 4 }}
                    />
                  )}
                </div>
                <div className="ml-4 text-right">
                  <Badge
                    count={`${Math.round(regionItem.priority_score * 100)}%`}
                    style={{ backgroundColor: getPriorityColor(regionItem.priority_score) }}
                  />
                </div>
              </div>
              <Progress
                percent={Math.round(regionItem.priority_score * 100)}
                strokeColor={getPriorityColor(regionItem.priority_score)}
                showInfo={false}
                size="small"
              />
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

