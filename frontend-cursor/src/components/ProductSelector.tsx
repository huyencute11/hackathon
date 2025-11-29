import { useState, useEffect } from 'react';
import { Modal, List, Checkbox, Spin, Empty, Input, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';
import type { Product } from '../types';

const { Search } = Input;

interface ProductSelectorProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (selectedIds: number[]) => void;
  initialSelected?: number[];
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  open,
  onClose,
  onConfirm,
  initialSelected = [],
}) => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>(initialSelected);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (open) {
      fetchProducts();
      setSelectedIds(initialSelected);
    }
  }, [open, initialSelected]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await apiService.getProducts();
      setProducts(data);
    } catch (error: any) {
      console.error('Error fetching products:', error);
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

  const handleToggle = (productId: number) => {
    setSelectedIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleConfirm = () => {
    onConfirm(selectedIds);
    onClose();
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group by category
  const groupedProducts = filteredProducts.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <Modal
      title={t('donation.selectProductsTitle')}
      open={open}
      onCancel={onClose}
      onOk={handleConfirm}
      okText={t('donation.confirm')}
      cancelText={t('donation.cancel')}
      width={700}
    >
      <div className="mb-4">
        <Search
          placeholder={t('common.search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Spin size="large" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <Empty description={t('common.noData')} />
      ) : (
        <div className="max-h-96 overflow-y-auto">
          {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
            <div key={category} className="mb-4">
              <div className="font-semibold text-sm text-gray-500 mb-2 uppercase">
                {category}
              </div>
              <List
                dataSource={categoryProducts}
                renderItem={(product) => (
                  <List.Item>
                    <div className="w-full flex items-start gap-3">
                      <Checkbox
                        checked={selectedIds.includes(product.id)}
                        onChange={() => handleToggle(product.id)}
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-base mb-1">{product.name}</div>
                        <div className="text-sm text-gray-600">{product.description}</div>
                      </div>
                      {selectedIds.includes(product.id) && (
                        <Tag color="green">{t('common.selected')}</Tag>
                      )}
                    </div>
                  </List.Item>
                )}
              />
            </div>
          ))}
        </div>
      )}

      {selectedIds.length > 0 && (
        <div className="mt-4 p-3 bg-green-50 rounded">
          <strong>{t('donation.selectedProducts', { count: selectedIds.length })}</strong>
        </div>
      )}
    </Modal>
  );
};
