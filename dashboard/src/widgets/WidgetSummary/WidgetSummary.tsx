import Chart from "react-apexcharts";
import WidgetSummary from "../../components/WidgetSummary/WidgetSummary";
import { useTheme } from "@mui/material/styles";

function WidgetSummaryWidget({
  title,
  chartType,
  per,
  size,
}: {
  title?: string;
  chartType?: "bar" | "line" | "area" | "radar" | "polarArea" | "donut";
  per?: number;
  size?: string;
}) {
  const theme = useTheme();
  const colors = [theme.palette["primary"].main, theme.palette["primary"].dark];

  const chartOptions = {
    colors: colors.map((colr) => colr[1]),
    fill: {
      type: "gradient",
      gradient: {
        colorStops: [
          { offset: 0, color: colors[0], opacity: 1 },
          { offset: 100, color: colors[1], opacity: 1 },
        ],
      },
    },
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "68%",
        borderRadius: 2,
      },
    },
    tooltip: {
      x: { show: false },
      y: {
        // eslint-disable-next-line no-undef
        formatter: (value) => Number(value),
        title: {
          formatter: () => "",
        },
      },
      marker: { show: false },
    },
  };

  const series = [20, 41, 63, 33, 28, 35, 50, 46, 11, 26];

  const Charst = () => {
    return (
      <Chart
        dir="ltr"
        type={chartType}
        series={[{ data: series }]}
        options={{
          ...chartOptions,
          tooltip: {
            ...chartOptions.tooltip,
            y: {
              formatter: (value) => String(value),
              title: {
                formatter: () => "",
              },
            },
          },
        }}
        width={60}
        height={36}
      />
    );
  };

  return (
    <WidgetSummary
      title={title}
      percent={per}
      total={size}
      chart={<Charst />}
      sx={{}}
    />
  );
}

export default WidgetSummaryWidget;
