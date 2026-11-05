import { useState, useEffect } from 'react';
import { api } from '../../shared/api/client';
import { Loader } from '../../shared/ui/Loader';
import { ErrorMessage } from '../../shared/ui/ErrorMessage';
import { EmptyState } from '../../shared/ui/EmptyState';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

export function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.get('/products');
        setProducts(data);
      } catch (err) {
        setError('Не удалось загрузить товары. Попробуйте позже.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  if (products.length === 0) return <EmptyState message="Товаров нет" />;

  return (
    <div>
      <h1>Каталог</h1>
      {products.map((p) => (
        <div key={p.id} style={{ border: '1px solid #ddd', margin: 8, padding: 8 }}>
          <strong>{p.title}</strong>
          <div>{p.price} $</div>
        </div>
      ))}
    </div>
  );
}