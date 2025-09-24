type KpiCardProps = {
  title: string;
  description?: string;
  value: React.ReactNode;
};

const KpiCard: React.FC<KpiCardProps> = ({ title, description, value }) => (
  <div className="h-full border border-gray-200 rounded-lg p-5 bg-white shadow-sm">
    <h3 className="m-0 text-lg font-semibold">{title}</h3>
    {description && <p className="my-2 text-gray-500 text-sm">{description}</p>}
    <div className="text-2xl font-bold">{value}</div>
  </div>
);

export default KpiCard;
