import { TbBackhoe, TbCamera, TbTruckDelivery, TbTractor, TbDeviceLaptop, TbConfetti, TbPackage } from "react-icons/tb";

const map = {
  "Construction Equipment": TbBackhoe,
  "Photography Equipment": TbCamera,
  "Vehicles & Transportation": TbTruckDelivery,
  "Agriculture Equipment": TbTractor,
  Electronics: TbDeviceLaptop,
  "Event Equipment": TbConfetti,
};

export default function CategoryIcon({ category, className = "" }) {
  const Icon = map[category] || TbPackage;
  return <Icon className={className} />;
}
