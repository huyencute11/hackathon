import { Modal, List, Empty, Typography, Tag } from 'antd';
import { EnvironmentOutlined, PhoneOutlined, MailOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { DonationLocation } from '../types';

const { Title, Text } = Typography;

interface DonationResultProps {
  open: boolean;
  onClose: () => void;
  locations: DonationLocation[];
}

export const DonationResult: React.FC<DonationResultProps> = ({
  open,
  onClose,
  locations,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      title={t('donation.donationLocationsTitle')}
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      {locations.length === 0 ? (
        <Empty description={t('donation.noLocationsFound')} />
      ) : (
        <List
          dataSource={locations}
          renderItem={(location) => (
            <List.Item className="hover:bg-gray-50 rounded p-4 mb-2">
              <div className="w-full">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <EnvironmentOutlined className="text-blue-500 text-lg" />
                    <Title level={5} className="mb-0">
                      {location.name}
                    </Title>
                  </div>
                  {location.distance && (
                    <Tag color="blue">
                      {location.distance} {t('providers.km')}
                    </Tag>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <strong>{t('donation.address')}:</strong>
                    <Text>{location.address}</Text>
                  </div>

                  {location.phone && (
                    <div className="flex items-center gap-2">
                      <PhoneOutlined className="text-gray-400" />
                      <Text>{location.phone}</Text>
                    </div>
                  )}

                  {location.email && (
                    <div className="flex items-center gap-2">
                      <MailOutlined className="text-gray-400" />
                      <Text>{location.email}</Text>
                    </div>
                  )}

                  {location.opening_hours && (
                    <div className="flex items-center gap-2">
                      <ClockCircleOutlined className="text-gray-400" />
                      <Text>{location.opening_hours}</Text>
                    </div>
                  )}

                  {location.notes && (
                    <div className="mt-2 p-2 bg-yellow-50 rounded">
                      <Text className="text-sm italic">{location.notes}</Text>
                    </div>
                  )}
                </div>
              </div>
            </List.Item>
          )}
        />
      )}
    </Modal>
  );
};

