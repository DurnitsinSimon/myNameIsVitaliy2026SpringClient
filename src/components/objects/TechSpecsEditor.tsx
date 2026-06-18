import { Button, Input, Space, Table } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { TechSpecItem } from '@/types';

interface Props {
  value?: TechSpecItem[];
  onChange?: (value: TechSpecItem[]) => void;
  disabled?: boolean;
}

/** Редактируемая таблица технико-экономических показателей. */
export function TechSpecsEditor({ value = [], onChange, disabled }: Props) {
  const update = (index: number, patch: Partial<TechSpecItem>) => {
    const next = value.map((item, i) => (i === index ? { ...item, ...patch } : item));
    onChange?.(next);
  };

  const add = () =>
    onChange?.([...value, { label: '', value: '', unit: '', sortOrder: value.length }]);

  const remove = (index: number) =>
    onChange?.(value.filter((_, i) => i !== index));

  return (
    <Space direction="vertical" style={{ width: '100%', maxWidth: 760 }}>
      <Table<TechSpecItem & { _i: number }>
        size="small"
        rowKey="_i"
        pagination={false}
        dataSource={value.map((v, i) => ({ ...v, _i: i }))}
        locale={{ emptyText: 'Нет показателей' }}
        columns={[
          {
            title: 'Показатель',
            dataIndex: 'label',
            render: (_, r) => (
              <Input
                value={r.label}
                disabled={disabled}
                placeholder="Площадь застройки"
                onChange={(e) => update(r._i, { label: e.target.value })}
              />
            ),
          },
          {
            title: 'Значение',
            dataIndex: 'value',
            width: 180,
            render: (_, r) => (
              <Input
                value={r.value}
                disabled={disabled}
                placeholder="12000"
                onChange={(e) => update(r._i, { value: e.target.value })}
              />
            ),
          },
          {
            title: 'Ед.',
            dataIndex: 'unit',
            width: 110,
            render: (_, r) => (
              <Input
                value={r.unit ?? ''}
                disabled={disabled}
                placeholder="м²"
                onChange={(e) => update(r._i, { unit: e.target.value })}
              />
            ),
          },
          {
            title: '',
            width: 48,
            render: (_, r) => (
              <Button
                type="text"
                danger
                disabled={disabled}
                icon={<DeleteOutlined />}
                onClick={() => remove(r._i)}
              />
            ),
          },
        ]}
      />
      {!disabled && (
        <Button icon={<PlusOutlined />} onClick={add}>
          Добавить показатель
        </Button>
      )}
    </Space>
  );
}
