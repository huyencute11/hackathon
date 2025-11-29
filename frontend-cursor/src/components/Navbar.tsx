import { Button, Space } from 'antd';
import { EnvironmentOutlined, ShoppingOutlined, HeartOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';

interface NavbarProps {
  onSelectRegion: () => void;
  onSelectProduct: () => void;
  onDonate: () => void;
  selectedRegionsCount: number;
  selectedProductsCount: number;
  isSubmitting?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSelectRegion,
  onSelectProduct,
  onDonate,
  selectedRegionsCount,
  selectedProductsCount,
  isSubmitting = false,
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white shadow-md border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-blue-600 mb-0">
              {t('app.title')}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Space size="middle">
              <Button
                type={selectedRegionsCount > 0 ? 'primary' : 'default'}
                icon={<EnvironmentOutlined />}
                onClick={onSelectRegion}
              >
                {t('donation.selectRegion')}
                {selectedRegionsCount > 0 && ` (${selectedRegionsCount})`}
              </Button>

              <Button
                type={selectedProductsCount > 0 ? 'primary' : 'default'}
                icon={<ShoppingOutlined />}
                onClick={onSelectProduct}
              >
                {t('donation.selectProduct')}
                {selectedProductsCount > 0 && ` (${selectedProductsCount})`}
              </Button>

              <Button
                type="primary"
                danger
                icon={<HeartOutlined />}
                onClick={onDonate}
                size="large"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? t('donation.submitting') : t('donation.iWantToDonate')}
              </Button>
            </Space>

            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </div>
  );
};
