import { Modal, List, Typography, Tag, Empty } from 'antd';
import { EnvironmentOutlined, PhoneOutlined, MailOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { DonationLocation } from '../types';

const { Text, Title } = Typography;

interface DonationLocationsProps {
  open: boolean;
  onClose: () => void;
  locations: DonationLocation[];
}

export const DonationLocations: React.FC<DonationLocationsProps> = ({
  open,
  onClose,
  locations,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <EnvironmentOutlined className="text-green-500" />
          <span>{t('donation.locationsTitle')}</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      {locations.length === 0 ? (
        <Empty description={t('donation.noLocations')} />
      ) : (
        <div className="space-y-4">
          <Text className="text-gray-600">{t('donation.locationsDescription')}</Text>
          <List
            dataSource={locations}
            renderItem={(location) => (
              <List.Item className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="w-full">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <Title level={5} className="mb-1">
                        {location.name}
                      </Title>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <EnvironmentOutlined />
                        <Text>{location.address}</Text>
                      </div>
                    </div>
                    {location.distance && (
                      <Tag color="green">
                        {location.distance} {t('providers.km')}
                      </Tag>
                    )}
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    {location.phone && (
                      <div className="flex items-center gap-2">
                        <PhoneOutlined />
                        <Text copyable={{ text: location.phone }}>{location.phone}</Text>
                      </div>
                    )}
                    {location.email && (
                      <div className="flex items-center gap-2">
                        <MailOutlined />
                        <Text copyable={{ text: location.email }}>{location.email}</Text>
                      </div>
                    )}
                    {location.opening_hours && (
                      <div className="flex items-center gap-2">
                        <ClockCircleOutlined />
                        <Text>{location.opening_hours}</Text>
                      </div>
                    )}
                    {location.notes && (
                      <div className="mt-2 p-2 bg-blue-50 rounded">
                        <Text className="text-sm text-blue-700">{location.notes}</Text>
                      </div>
                    )}
                  </div>
                </div>
              </List.Item>
            )}
          />
        </div>
      )}
    </Modal>
  );
};

