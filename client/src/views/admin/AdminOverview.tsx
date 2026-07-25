import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import { FileText, FolderKanban, Trophy, Users as UsersIcon, Vote } from "lucide-react";
import { getAdminAnalytics } from "../../api/admin.ts";
import type { AdminAnalytics } from "../../types/index.ts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

function formatBucketLabel(bucket: string) {
  return new Date(bucket).toLocaleString([], { month: "short", day: "numeric", hour: "numeric" });
}

const TIME_SERIES_CONFIG = {
  projectVotes: { label: "Project Votes", color: "var(--chart-1)" },
  paperVotes: { label: "Paper Votes", color: "var(--chart-2)" },
} satisfies ChartConfig;

const PROJECT_BARS_CONFIG = {
  voteCount: { label: "Votes", color: "var(--chart-1)" },
} satisfies ChartConfig;

const PAPER_BARS_CONFIG = {
  voteCount: { label: "Votes", color: "var(--chart-2)" },
} satisfies ChartConfig;

const SHARE_CONFIG = {
  project: { label: "Project Votes", color: "var(--chart-1)" },
  paper: { label: "Research Paper Votes", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function AdminOverview() {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminAnalytics()
      .then((res) => setAnalytics(res))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !analytics) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
    );
  }

  const { totals, votesByProject, votesByPaper, votesOverTime } = analytics;

  const voterParticipation =
    totals.totalUsers === 0 ? 0 : Math.round(((totals.votedProjectUsers + totals.votedPaperUsers) / (totals.totalUsers * 2)) * 100);

  const timeSeriesData = votesOverTime.map((row) => ({
    ...row,
    label: formatBucketLabel(row.bucket),
  }));

  const topProjects = [...votesByProject].slice(0, 8).reverse();
  const topPapers = [...votesByPaper].slice(0, 8).reverse();

  const shareData = [
    { key: "project", name: "Project Votes", value: totals.totalProjectVotes, fill: "var(--chart-1)" },
    { key: "paper", name: "Research Paper Votes", value: totals.totalPaperVotes, fill: "var(--chart-2)" },
  ];

  const statCards = [
    {
      label: "Projects",
      value: `${totals.activeProjects}/${totals.totalProjects}`,
      hint: "active / total",
      icon: FolderKanban,
    },
    {
      label: "Research Papers",
      value: `${totals.activeResearchPapers}/${totals.totalResearchPapers}`,
      hint: "active / total",
      icon: FileText,
    },
    { label: "Project Votes", value: totals.totalProjectVotes.toLocaleString(), hint: "cast so far", icon: Vote },
    { label: "Paper Votes", value: totals.totalPaperVotes.toLocaleString(), hint: "cast so far", icon: Trophy },
    {
      label: "Registered Voters",
      value: totals.totalUsers.toLocaleString(),
      hint: `${totals.blockedUsers} blocked`,
      icon: UsersIcon,
    },
    { label: "Participation", value: `${voterParticipation}%`, hint: "of possible votes cast", icon: Vote },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">Votes Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          {timeSeriesData.length === 0 ? (
            <EmptyState />
          ) : (
            <ChartContainer config={TIME_SERIES_CONFIG} className="h-72 w-full">
              <LineChart data={timeSeriesData} margin={{ left: 4, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="projectVotes" stroke="var(--color-projectVotes)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="paperVotes" stroke="var(--color-paperVotes)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">Votes by Project</CardTitle>
          </CardHeader>
          <CardContent>
            {topProjects.length === 0 ? (
              <EmptyState />
            ) : (
              <ChartContainer config={PROJECT_BARS_CONFIG} className="h-80 w-full">
                <BarChart data={topProjects} layout="vertical" margin={{ left: 12 }}>
                  <CartesianGrid horizontal={false} />
                  <XAxis type="number" tickLine={false} axisLine={false} allowDecimals={false} fontSize={12} />
                  <YAxis
                    type="category"
                    dataKey="title"
                    tickLine={false}
                    axisLine={false}
                    width={110}
                    fontSize={12}
                    tickFormatter={(value: string) => (value.length > 16 ? `${value.slice(0, 16)}…` : value)}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="voteCount" fill="var(--color-voteCount)" radius={4} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">Votes by Research Paper</CardTitle>
          </CardHeader>
          <CardContent>
            {topPapers.length === 0 ? (
              <EmptyState />
            ) : (
              <ChartContainer config={PAPER_BARS_CONFIG} className="h-80 w-full">
                <BarChart data={topPapers} layout="vertical" margin={{ left: 12 }}>
                  <CartesianGrid horizontal={false} />
                  <XAxis type="number" tickLine={false} axisLine={false} allowDecimals={false} fontSize={12} />
                  <YAxis
                    type="category"
                    dataKey="title"
                    tickLine={false}
                    axisLine={false}
                    width={110}
                    fontSize={12}
                    tickFormatter={(value: string) => (value.length > 16 ? `${value.slice(0, 16)}…` : value)}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="voteCount" fill="var(--color-voteCount)" radius={4} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">Project vs Research Paper Votes</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          {shareData.every((d) => d.value === 0) ? (
            <EmptyState />
          ) : (
            <ChartContainer config={SHARE_CONFIG} className="h-72 w-full max-w-xs">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie data={shareData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} strokeWidth={2}>
                  {shareData.map((entry) => (
                    <Cell key={entry.key} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function EmptyState() {
  return <p className="flex h-40 items-center justify-center text-sm text-muted-foreground">No votes yet.</p>;
}
