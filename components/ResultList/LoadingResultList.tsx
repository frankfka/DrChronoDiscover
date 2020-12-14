import { List, Skeleton } from 'antd';

interface LoadingResultListProps {
  numItems: number;
  className?: string;
}

export default function LoadingResultList({
  numItems,
  className,
}: LoadingResultListProps): JSX.Element {
  return (
    <List
      loading={true}
      className={className}
      itemLayout={'vertical'}
      dataSource={new Array(numItems).fill('')}
      renderItem={() => <Skeleton active />}
    />
  );
}
