import PerformanceChart from "../DepartmantCharts/PerformanceChart";
import React from "react";
import TotalIncomes from "../DepartmantCharts/TotalIncomes";
import { TwoSideLayout } from "@canmingir/link/layouts";
import UsageChart from "../DepartmantCharts/UsageChart";

const StaticsWidget = () => {
  return (
    <TwoSideLayout
      rows={{
        firstRow: [<UsageChart key={2} />, <PerformanceChart key={3} />],
        secondRow: [<TotalIncomes key={4} />],
      }}
    />
  );
};

export default StaticsWidget;
