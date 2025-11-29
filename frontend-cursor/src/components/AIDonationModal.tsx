import { useState } from 'react';
import { Modal, Button, Card, Tag, Alert, Spin, Typography, Divider, Space, List } from 'antd';
import { RobotOutlined, HeartOutlined, EnvironmentOutlined, StarFilled } from '@ant-design/icons';
import type { AIDonationResponse } from '../types';

const { Title, Text, Paragraph } = Typography;

interface AIDonationModalProps {
  visible: boolean;
  onClose: () => void;
  response: AIDonationResponse | null;
  loading: boolean;
}

export const AIDonationModal: React.FC<AIDonationModalProps> = ({
  visible,
  onClose,
  response,
  loading,
}) => {
  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose} type="primary" size="large">
          Đóng
        </Button>,
      ]}
      width={800}
      centered
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Spin size="large" />
          <Paragraph style={{ marginTop: 20, color: '#666' }}>
            <RobotOutlined style={{ marginRight: 8 }} />
            AI đang phân tích database và đưa ra gợi ý...
          </Paragraph>
        </div>
      ) : response ? (
        <div>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Title level={3}>
              <HeartOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
              Gợi ý quyên góp cho {response.region_name}
            </Title>
          </div>

          {/* AI Message */}
          <Alert
            message={
              <Space>
                <RobotOutlined />
                <Text strong>Groq AI</Text>
              </Space>
            }
            description={response.ai_message}
            type="info"
            showIcon={false}
            style={{ marginBottom: 24 }}
          />

          {/* Suggested Items */}
          <Card
            title={
              <Space>
                <StarFilled style={{ color: '#faad14' }} />
                <Text strong>Món đồ được gợi ý (AI phân tích từ database)</Text>
              </Space>
            }
            style={{ marginBottom: 24 }}
          >
            <List
              dataSource={response.suggested_items}
              renderItem={(item, index) => (
                <List.Item key={item.item.id}>
                  <List.Item.Meta
                    avatar={
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          background: '#1890ff',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                        }}
                      >
                        #{index + 1}
                      </div>
                    }
                    title={
                      <Space>
                        <Text strong>{item.item.name}</Text>
                        <Tag color="orange">
                          Priority: {(item.priority_score * 100).toFixed(0)}%
                        </Tag>
                      </Space>
                    }
                    description={
                      <div>
                        <Text type="secondary">{item.item.description}</Text>
                        <div style={{ marginTop: 8 }}>
                          <Text style={{ color: '#1890ff' }}>
                            💡 <strong>AI Analysis:</strong> {item.reason}
                          </Text>
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>

          {/* Donation Locations */}
          <Card
            title={
              <Space>
                <EnvironmentOutlined style={{ color: '#52c41a' }} />
                <Text strong>Địa điểm quyên góp ({response.donation_locations.length})</Text>
              </Space>
            }
          >
            <List
              dataSource={response.donation_locations}
              renderItem={(location) => (
                <List.Item 
                  key={location.id}
                  extra={
                    location.distance !== undefined && location.distance !== null ? (
                      <Tag color="blue" style={{ fontSize: '14px', padding: '4px 12px' }}>
                        📍 {location.distance.toFixed(1)} km
                      </Tag>
                    ) : null
                  }
                >
                  <List.Item.Meta
                    avatar={<EnvironmentOutlined style={{ fontSize: 24, color: '#52c41a' }} />}
                    title={
                      <Space>
                        <Text strong>{location.name}</Text>
                        {location.distance !== undefined && location.distance !== null && location.distance < 5 && (
                          <Tag color="green">Gần bạn</Tag>
                        )}
                      </Space>
                    }
                    description={
                      <div>
                        <div>📍 {location.address}</div>
                        {location.phone && <div>📞 {location.phone}</div>}
                        {location.opening_hours && <div>🕐 {location.opening_hours}</div>}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>

          {/* Footer Info */}
          <Divider />
          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">
              <RobotOutlined style={{ marginRight: 4 }} />
              Được hỗ trợ bởi Groq AI - Phân tích thông minh từ database
            </Text>
          </div>
        </div>
      ) : null}
    </Modal>
  );
};

