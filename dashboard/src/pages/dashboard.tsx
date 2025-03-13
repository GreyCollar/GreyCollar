import { Helmet } from "react-helmet-async";
import PerformanceChart from "../widgets/DepartmantCharts/PerformanceChart";
import React from "react";
import TotalIncomes from "../widgets/DepartmantCharts/TotalIncomes";
import { TwoSideLayout } from "@nucleoidai/platform/layouts";
import UsageChart from "../widgets/DepartmantCharts/UsageChart";
import WidgetSummaryWidget from "../widgets/WidgetSummary/WidgetSummary";
import config from "../../config";
import useStatistics from "../hooks/useStatistics";

function Dashboard() {
  const { statistics } = useStatistics();

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title> {config.name} - Dashboard </title>
      </Helmet>

      <TwoSideLayout
        rows={{
          fourthRow: [
            <WidgetSummaryWidget
              key={5}
              title="Response Rate"
              chartType={"bar"}
              size={statistics.responseRate}
            />,
            <WidgetSummaryWidget
              key={6}
              title="Supervising Rate"
              chartType={"line"}
              size={statistics.supervisingRate}
            />,
            <WidgetSummaryWidget
              key={7}
              title="Knowledge Size"
              chartType={"line"}
              size={statistics.knowledgeSize}
            />,
            <WidgetSummaryWidget
              key={8}
              title="Task Rate"
              chartType={"bar"}
              size={statistics.taskCount}
            />,
          ],
          secondRow: [<UsageChart key={2} />, <PerformanceChart key={3} />],
          thirdRow: [<TotalIncomes size={statistics.totalMessages} key={4} />],
        }}
      />
    </>
  );
}
export default Dashboard;
