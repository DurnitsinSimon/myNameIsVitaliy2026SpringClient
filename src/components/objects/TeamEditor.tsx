import { AutoComplete, Button, Input, Space, Table } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useDictionaries } from '@/hooks/useDictionaries';
import type { TeamMemberItem } from '@/types';

interface Props {
  value?: TeamMemberItem[];
  onChange?: (value: TeamMemberItem[]) => void;
  disabled?: boolean;
}

// Типовые роли проектной команды (см. ТЗ §7.3).
const DEFAULT_ROLES = [
  'Руководитель проекта',
  'Главный архитектор проекта',
  'Главный инженер проекта',
  'Архитектор',
  'Инженер',
  'BIM-специалист',
  'Визуализатор',
  'Партнёр / подрядчик',
];

/** Редактируемая таблица участников проекта. */
export function TeamEditor({ value = [], onChange, disabled }: Props) {
  const { data: roleDict } = useDictionaries('INPAD_ROLE');
  const roleOptions = [
    ...DEFAULT_ROLES,
    ...(roleDict ?? []).map((d) => d.name),
  ].map((r) => ({ value: r }));

  const update = (index: number, patch: Partial<TeamMemberItem>) =>
    onChange?.(value.map((item, i) => (i === index ? { ...item, ...patch } : item)));

  const add = () =>
    onChange?.([...value, { role: '', name: '', sortOrder: value.length }]);

  const remove = (index: number) =>
    onChange?.(value.filter((_, i) => i !== index));

  return (
    <Space direction="vertical" style={{ width: '100%', maxWidth: 760 }}>
      <Table<TeamMemberItem & { _i: number }>
        size="small"
        rowKey="_i"
        pagination={false}
        dataSource={value.map((v, i) => ({ ...v, _i: i }))}
        locale={{ emptyText: 'Команда не заполнена' }}
        columns={[
          {
            title: 'Должность',
            dataIndex: 'role',
            width: 280,
            render: (_, r) => (
              <AutoComplete
                style={{ width: '100%' }}
                value={r.role}
                disabled={disabled}
                placeholder="ГАП"
                options={roleOptions}
                filterOption={(input, option) =>
                  String(option?.value ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                onChange={(v) => update(r._i, { role: v })}
              />
            ),
          },
          {
            title: 'Участник',
            dataIndex: 'name',
            render: (_, r) => (
              <Input
                value={r.name}
                disabled={disabled}
                placeholder="Иванов И.И."
                onChange={(e) => update(r._i, { name: e.target.value })}
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
          Добавить участника
        </Button>
      )}
    </Space>
  );
}
