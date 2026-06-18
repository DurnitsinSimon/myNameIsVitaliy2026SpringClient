import { Tag } from 'antd';
import {
  OBJECT_STATUS_COLORS,
  OBJECT_STATUS_LABELS,
  WP_STATUS_COLORS,
  WP_STATUS_LABELS,
} from '@/constants';
import type { ObjectStatus, WpPublishStatus } from '@/types';

export function ObjectStatusTag({ status }: { status: ObjectStatus }) {
  return (
    <Tag color={OBJECT_STATUS_COLORS[status]} style={{ margin: 0 }}>
      {OBJECT_STATUS_LABELS[status]}
    </Tag>
  );
}

export function WpStatusTag({ status }: { status: WpPublishStatus }) {
  return (
    <Tag color={WP_STATUS_COLORS[status]} style={{ margin: 0 }}>
      {WP_STATUS_LABELS[status]}
    </Tag>
  );
}
