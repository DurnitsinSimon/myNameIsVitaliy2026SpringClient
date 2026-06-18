import { Select } from 'antd';
import { useCategories } from '@/hooks/useCategories';

interface Props {
  value?: string[];
  onChange?: (value: string[]) => void;
  disabled?: boolean;
}

/** Множественный выбор категорий объекта (UUID). */
export function CategoriesField({ value, onChange, disabled }: Props) {
  const { data, isLoading } = useCategories();

  return (
    <Select
      mode="multiple"
      allowClear
      loading={isLoading}
      disabled={disabled}
      value={value}
      onChange={onChange}
      placeholder="Выберите категории"
      optionFilterProp="label"
      options={(data ?? []).map((c) => ({ value: c.id, label: c.name }))}
    />
  );
}
