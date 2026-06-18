import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <Result
      status="404"
      title="Страница не найдена"
      subTitle="Запрашиваемый раздел не существует."
      extra={
        <Button type="primary" onClick={() => navigate('/objects')}>
          К списку объектов
        </Button>
      }
    />
  );
}
