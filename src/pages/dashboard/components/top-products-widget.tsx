import React from "react";
import { TopProductsChart } from "../charts/TopProductsChart";

interface Props {
  data: any[];
}

export const TopProductsWidget: React.FC<Props> = ({ data }) => {
  return <TopProductsChart data={data} />;
};
