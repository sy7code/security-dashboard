"use client";

import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { Vulnerability } from "../types/vulnerability";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardChartsProps {
  vulnerabilities: Vulnerability[];
}

export default function DashboardCharts({ vulnerabilities }: DashboardChartsProps) {
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month">("day");

  // 1. Severity Distribution (Doughnut)
  const severityCounts = {
    CRITICAL: 0,
    HIGH: 0,
    MEDIUM: 0,
    LOW: 0,
  };

  vulnerabilities.forEach((v) => {
    const sev = v.severity?.toUpperCase() || "LOW";
    if (Reflect.has(severityCounts, sev)) {
      severityCounts[sev as keyof typeof severityCounts]++;
    } else {
      severityCounts.LOW++;
    }
  });

  const doughnutData = {
    labels: ["Critical", "High", "Medium", "Low"],
    datasets: [
      {
        data: [
          severityCounts.CRITICAL,
          severityCounts.HIGH,
          severityCounts.MEDIUM,
          severityCounts.LOW,
        ],
        backgroundColor: [
          "rgba(239, 68, 68, 0.8)", // Red
          "rgba(249, 115, 22, 0.8)", // Orange
          "rgba(234, 179, 8, 0.8)", // Yellow
          "rgba(59, 130, 246, 0.8)", // Blue
        ],
        borderColor: [
          "rgba(239, 68, 68, 1)",
          "rgba(249, 115, 22, 1)",
          "rgba(234, 179, 8, 1)",
          "rgba(59, 130, 246, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: { color: "rgba(255, 255, 255, 0.7)" },
      },
    },
  };

  // 2. AI Resolved (Bar)
  const getPeriodData = () => {
    const labels: string[] = [];
    const valuesResolved: number[] = [];
    const valuesUnresolved: number[] = [];
    const now = new Date();

    const resolvedVulns = vulnerabilities.filter((v) => {
      const status = v.status?.toUpperCase() || "";
      const approval = v.approvalStatus?.toUpperCase() || "";
      return (
        status.includes("RESOLVED") ||
        approval.includes("APPROVED") ||
        status.includes("DONE")
      );
    });

    const unresolvedVulns = vulnerabilities.filter((v) => {
      const status = v.status?.toUpperCase() || "";
      const approval = v.approvalStatus?.toUpperCase() || "";
      return !(
        status.includes("RESOLVED") ||
        approval.includes("APPROVED") ||
        status.includes("DONE")
      );
    });

    if (timeRange === "day") {
      // Last 7 days
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return { dateString: d.toISOString().split("T")[0], dateObj: d };
      });

      const countsResolved: Record<string, number> = {};
      const countsUnresolved: Record<string, number> = {};
      last7Days.forEach((d) => {
        countsResolved[d.dateString] = 0;
        countsUnresolved[d.dateString] = 0;
      });

      resolvedVulns.forEach((v) => {
        if (v.createdAt) {
          const dateStr = v.createdAt.split("T")[0];
          if (Reflect.has(countsResolved, dateStr)) {
            countsResolved[dateStr]++;
          }
        }
      });
      unresolvedVulns.forEach((v) => {
        if (v.createdAt) {
          const dateStr = v.createdAt.split("T")[0];
          if (Reflect.has(countsUnresolved, dateStr)) {
            countsUnresolved[dateStr]++;
          }
        }
      });

      last7Days.forEach((d) => {
        labels.push(`${d.dateObj.getMonth() + 1}/${d.dateObj.getDate()}`);
        valuesResolved.push(countsResolved[d.dateString]);
        valuesUnresolved.push(countsUnresolved[d.dateString]);
      });
    } else if (timeRange === "week") {
      // Last 4 weeks
      const getWeekLabel = (d: Date) => {
        const start = new Date(d);
        start.setDate(start.getDate() - start.getDay());
        return `${start.getMonth() + 1}/${start.getDate()} 주`;
      };

      const weekLabelsArr = Array.from({ length: 4 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (3 - i) * 7);
        return getWeekLabel(d);
      });

      const countsResolved: Record<string, number> = {};
      const countsUnresolved: Record<string, number> = {};
      weekLabelsArr.forEach((l) => {
        countsResolved[l] = 0;
        countsUnresolved[l] = 0;
      });

      resolvedVulns.forEach((v) => {
        if (v.createdAt) {
          const d = new Date(v.createdAt);
          if (d.getTime() > now.getTime() - 4 * 7 * 24 * 60 * 60 * 1000) {
            const label = getWeekLabel(d);
            if (Reflect.has(countsResolved, label)) {
              countsResolved[label]++;
            }
          }
        }
      });
      unresolvedVulns.forEach((v) => {
        if (v.createdAt) {
          const d = new Date(v.createdAt);
          if (d.getTime() > now.getTime() - 4 * 7 * 24 * 60 * 60 * 1000) {
            const label = getWeekLabel(d);
            if (Reflect.has(countsUnresolved, label)) {
              countsUnresolved[label]++;
            }
          }
        }
      });

      weekLabelsArr.forEach((w) => {
        labels.push(w);
        valuesResolved.push(countsResolved[w]);
        valuesUnresolved.push(countsUnresolved[w]);
      });
    } else if (timeRange === "month") {
      // Last 6 months
      const last6Months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (5 - i));
        return { year: d.getFullYear(), month: d.getMonth() };
      });

      const countsResolved: Record<string, number> = {};
      const countsUnresolved: Record<string, number> = {};
      last6Months.forEach((m) => {
        countsResolved[`${m.year}-${m.month}`] = 0;
        countsUnresolved[`${m.year}-${m.month}`] = 0;
      });

      resolvedVulns.forEach((v) => {
        if (v.createdAt) {
          const d = new Date(v.createdAt);
          const key = `${d.getFullYear()}-${d.getMonth()}`;
          if (Reflect.has(countsResolved, key)) {
            countsResolved[key]++;
          }
        }
      });
      unresolvedVulns.forEach((v) => {
        if (v.createdAt) {
          const d = new Date(v.createdAt);
          const key = `${d.getFullYear()}-${d.getMonth()}`;
          if (Reflect.has(countsUnresolved, key)) {
            countsUnresolved[key]++;
          }
        }
      });

      last6Months.forEach((m) => {
        labels.push(`${m.month + 1}월`);
        valuesResolved.push(countsResolved[`${m.year}-${m.month}`]);
        valuesUnresolved.push(countsUnresolved[`${m.year}-${m.month}`]);
      });
    }

    return { labels, valuesResolved, valuesUnresolved };
  };

  const {
    labels: barLabels,
    valuesResolved: barValuesResolved,
    valuesUnresolved: barValuesUnresolved,
  } = getPeriodData();

  const barData = {
    labels: barLabels,
    datasets: [
      {
        label: "해결된 취약점 수",
        data: barValuesResolved,
        backgroundColor: "rgba(34, 197, 94, 0.5)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: "미해결 취약점 수",
        data: barValuesUnresolved,
        backgroundColor: "rgba(239, 68, 68, 0.5)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: "rgba(255, 255, 255, 0.7)" },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: "rgba(255, 255, 255, 0.7)", stepSize: 1 },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
      x: {
        ticks: { color: "rgba(255, 255, 255, 0.7)" },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
      <div className="bg-[#111111] border border-gray-800/60 rounded-2xl p-6 shadow-xl backdrop-blur-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-gray-200 font-semibold flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              ></path>
            </svg>
            AI 해결 취약점 통계
          </h3>
          <select
            value={timeRange}
            onChange={(e) =>
              setTimeRange(e.target.value as "day" | "week" | "month")
            }
            className="bg-[#1a1a1a] border border-gray-700 text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 outline-none"
          >
            <option value="day">일별 (최근 7일)</option>
            <option value="week">주별 (최근 4주)</option>
            <option value="month">월별 (최근 6개월)</option>
          </select>
        </div>
        <div className="h-[250px] w-full">
          <Bar data={barData} options={chartOptions} />
        </div>
      </div>
      <div className="bg-[#111111] border border-gray-800/60 rounded-2xl p-6 shadow-xl backdrop-blur-xl">
        <h3 className="text-gray-200 font-semibold mb-6 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-purple-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
            ></path>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
            ></path>
          </svg>
          위험도 분포도
        </h3>
        <div className="h-[250px] w-full flex justify-center">
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      </div>
    </div>
  );
}
