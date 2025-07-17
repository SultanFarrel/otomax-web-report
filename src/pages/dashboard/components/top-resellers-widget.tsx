import React from "react";
import { TopResellersList } from "./top-resellers-list";

interface Props {
  data: any[];
}

export const TopResellersWidget: React.FC<Props> = ({ data }) => {
  return <TopResellersList data={data} />;
};
