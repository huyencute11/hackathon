import { Row, Col, Typography, Divider } from 'antd';
import {
  HeartOutlined,
  TeamOutlined,
  GlobalOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Text, Link } = Typography;

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gradient-to-b from-blue-50 via-white to-gray-50 border-t-2 border-blue-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Content */}
        <Row gutter={[32, 32]}>
          {/* About Section */}
          <Col xs={24} sm={12} md={6}>
            <div className="flex items-center gap-2 mb-4">
              <HeartOutlined className="text-red-500 text-2xl" />
              <Title level={4} className="mb-0 text-blue-600">
                {t('footer.about.title')}
              </Title>
            </div>
            <Text className="text-gray-600 text-sm leading-relaxed">
              {t('footer.about.description')}
            </Text>
          </Col>

          {/* Quick Links */}
          <Col xs={24} sm={12} md={6}>
            <Title level={5} className="mb-4 text-gray-800">
              {t('footer.quickLinks.title')}
            </Title>
            <div className="flex flex-col gap-2">
              <Link 
                href="/" 
                className="text-gray-600 hover:text-blue-600 text-sm transition-colors duration-200 hover:translate-x-1 inline-block"
              >
                {t('footer.quickLinks.home')}
              </Link>
              <Link 
                href="/#regions" 
                className="text-gray-600 hover:text-blue-600 text-sm transition-colors duration-200 hover:translate-x-1 inline-block"
              >
                {t('footer.quickLinks.regions')}
              </Link>
              <Link 
                href="/#donate" 
                className="text-gray-600 hover:text-blue-600 text-sm transition-colors duration-200 hover:translate-x-1 inline-block"
              >
                {t('footer.quickLinks.donate')}
              </Link>
              <Link 
                href="/#how-it-works" 
                className="text-gray-600 hover:text-blue-600 text-sm transition-colors duration-200 hover:translate-x-1 inline-block"
              >
                {t('footer.quickLinks.howItWorks')}
              </Link>
            </div>
          </Col>

          {/* Contact Info */}
          <Col xs={24} sm={12} md={6}>
            <Title level={5} className="mb-4 text-gray-800">
              {t('footer.contact.title')}
            </Title>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2">
                <EnvironmentOutlined className="text-blue-500 mt-1" />
                <Text className="text-gray-600 text-sm">
                  {t('footer.contact.address')}
                </Text>
              </div>
              <div className="flex items-center gap-2">
                <PhoneOutlined className="text-blue-500" />
                <Link href="tel:+84123456789" className="text-gray-600 hover:text-blue-600 text-sm">
                  +84 123 456 789
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <MailOutlined className="text-blue-500" />
                <Link href="mailto:support@relief.org" className="text-gray-600 hover:text-blue-600 text-sm">
                  support@relief.org
                </Link>
              </div>
            </div>
          </Col>

          {/* Social Media & Mission */}
          <Col xs={24} sm={12} md={6}>
            <Title level={5} className="mb-4 text-gray-800">
              {t('footer.followUs.title')}
            </Title>
            <div className="flex gap-3 mb-4">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-xl transition-all duration-200 hover:scale-110"
              >
                <FacebookOutlined />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-600 text-xl transition-all duration-200 hover:scale-110"
              >
                <TwitterOutlined />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-500 hover:text-pink-700 text-xl transition-all duration-200 hover:scale-110"
              >
                <InstagramOutlined />
              </Link>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <TeamOutlined className="text-blue-600 text-lg" />
                <Text strong className="text-blue-600 text-sm">
                  {t('footer.mission.title')}
                </Text>
              </div>
              <Text className="text-gray-700 text-xs leading-relaxed">
                {t('footer.mission.description')}
              </Text>
            </div>
          </Col>
        </Row>

        <Divider className="my-8" />

        {/* Bottom Section */}
        <Row justify="space-between" align="middle" className="flex-wrap">
          <Col xs={24} sm={12}>
            <div className="flex items-center gap-2 mb-2">
              <GlobalOutlined className="text-blue-500" />
              <Text className="text-gray-600 text-sm font-medium">
                {t('footer.copyright')}
              </Text>
            </div>
            <Text className="text-gray-500 text-xs">
              {t('footer.rights')}
            </Text>
          </Col>
          <Col xs={24} sm={12} className="text-right sm:text-left sm:mt-0 mt-4">
            <Text className="text-gray-600 text-sm italic font-medium">
              {t('footer.message')}
            </Text>
          </Col>
        </Row>
      </div>
    </footer>
  );
};

