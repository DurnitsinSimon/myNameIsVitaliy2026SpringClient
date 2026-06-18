import { Select } from 'antd';
import { useDictionaries } from '@/hooks/useDictionaries';
import type { DictionaryType } from '@/types';

interface Props {
  type: DictionaryType;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

/** Выпадающий список значений из административного справочника. */
export function DictionarySelect({ type, value, onChange, placeholder }: Props) {
  const { data, isLoading } = useDictionaries(type);

  return (
    <Select
      showSearch
      allowClear
      loading={isLoading}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      options={(data ?? []).map((d) => ({ value: d.name, label: d.name }))}
      filterOption={(input, option) =>
        String(option?.label ?? '')
          .toLowerCase()
          .includes(input.toLowerCase())
      }
    />
  );
}
