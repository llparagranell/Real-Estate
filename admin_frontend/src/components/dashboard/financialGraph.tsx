"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const description = "Financial Graph"

type PresetKey = "7d" | "1m" | "6m" | "1y"

type DateBucket = {
  start: Date
  end: Date
  label: string
}

type FinancialAnalyticsCompact = {
  customTotalGemsPaid: number | null
  customTotalRevenueBySellingExclusiveProperties: number | null
}

type FinancialPoint = {
  date: string
  desktop: number
  mobile: number
}

const chartConfig = {
  desktop: {
    label: "Gem Payout Amount",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Total Exclusive Property Sold Amount Stats",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
}

function endOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999)
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function formatAsYmd(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function dateLabel(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date)
}

function buildBuckets(start: Date, end: Date, stepDays: number): DateBucket[] {
  const buckets: DateBucket[] = []
  let cursor = startOfDay(start)
  const endBound = endOfDay(end)

  while (cursor <= endBound) {
    const bucketStart = startOfDay(cursor)
    const bucketEnd = endOfDay(addDays(bucketStart, stepDays - 1))
    const clampedEnd = bucketEnd > endBound ? endBound : bucketEnd

    buckets.push({
      start: bucketStart,
      end: clampedEnd,
      label: stepDays === 1 ? dateLabel(bucketStart) : `${dateLabel(bucketStart)} - ${dateLabel(clampedEnd)}`,
    })

    cursor = startOfDay(addDays(bucketStart, stepDays))
  }

  return buckets
}

function getPresetRange(preset: PresetKey): { start: Date; end: Date; stepDays: number } {
  const now = new Date()
  const end = endOfDay(now)

  if (preset === "7d") {
    return { start: startOfDay(addDays(now, -6)), end, stepDays: 1 }
  }
  if (preset === "1m") {
    return { start: startOfDay(addDays(now, -29)), end, stepDays: 2 }
  }
  if (preset === "6m") {
    return { start: startOfDay(addDays(now, -179)), end, stepDays: 7 }
  }
  return { start: startOfDay(addDays(now, -364)), end, stepDays: 15 }
}

function getCustomStepDays(start: Date, end: Date): number {
  const diffMs = endOfDay(end).getTime() - startOfDay(start).getTime()
  const totalDays = Math.max(Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1, 1)

  if (totalDays <= 14) return 1
  if (totalDays <= 60) return 2
  if (totalDays <= 180) return 7
  return 15
}

export function FinancialGraph() {
  const [preset, setPreset] = React.useState<PresetKey>("1m")
  const [showCustomPanel, setShowCustomPanel] = React.useState(false)
  const [customFrom, setCustomFrom] = React.useState("")
  const [customTo, setCustomTo] = React.useState("")
  const [customApplied, setCustomApplied] = React.useState<{ from: string; to: string } | null>(null)

  const { data, isError } = useQuery({
    queryKey: ["dashboard", "financial-graph", preset, customApplied?.from, customApplied?.to],
    queryFn: async () => {
      let start: Date
      let end: Date
      let stepDays: number

      if (customApplied) {
        start = startOfDay(new Date(customApplied.from))
        end = endOfDay(new Date(customApplied.to))
        stepDays = getCustomStepDays(start, end)
      } else {
        const presetRange = getPresetRange(preset)
        start = presetRange.start
        end = presetRange.end
        stepDays = presetRange.stepDays
      }

      const buckets = buildBuckets(start, end, stepDays)

      const points = await Promise.all(
        buckets.map(async (bucket) => {
          const from = formatAsYmd(bucket.start)
          const to = formatAsYmd(bucket.end)

          const response = await api.get<{ success: boolean; data: FinancialAnalyticsCompact }>(
            `/analytics/financials?view=compact&from=${from}&to=${to}`
          )

          const compact = response.data.data

          return {
            date: bucket.label,
            desktop: compact.customTotalGemsPaid ?? 0,
            mobile: compact.customTotalRevenueBySellingExclusiveProperties ?? 0,
          }
        })
      )

      return points
    },
    staleTime: 60 * 1000,
  })

  const chartData = React.useMemo<FinancialPoint[]>(() => data ?? [], [data])

  const rangeLabel = customApplied
    ? `${customApplied.from} to ${customApplied.to}`
    : ({
      "7d": "Last 7 Days",
      "1m": "Last 1 Month",
      "6m": "Last 6 Months",
      "1y": "Last 1 Year",
    } as const)[preset]

  const applyCustomRange = () => {
    if (!customFrom || !customTo) return
    if (new Date(customFrom) > new Date(customTo)) return
    setCustomApplied({ from: customFrom, to: customTo })
  }

  const clearCustomRange = () => {
    setCustomApplied(null)
  }

  if (isError) {
    return <div className="rounded-lg border p-4 text-sm text-red-500">Failed to load financial graph.</div>
  }

  return (
    <Card className="pt-0">
      <CardHeader className="border-b py-5">
        <div className="grid flex-1 gap-1">
          <CardTitle>Financial Graph</CardTitle>
          <CardDescription>Gem payout amount vs total exclusive property sold amount stats</CardDescription>
        </div>

        <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-muted-foreground">{rangeLabel}</p>

          <div className="flex flex-wrap items-center gap-2 md:justify-end">
            <Button
              size="sm"
              className="bg-blue-600 text-white hover:bg-blue-700 font-medium"
              onClick={() => setShowCustomPanel((prev) => !prev)}
            >
              Select Date Range
            </Button>

            <Select
              value={preset}
              onValueChange={(value) => {
                setPreset(value as PresetKey)
                setCustomApplied(null)
              }}
            >
              <SelectTrigger className="w-42.5 font-medium text-black">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="1m">1 Month</SelectItem>
                <SelectItem value="6m">6 Months</SelectItem>
                <SelectItem value="1y">1 Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {showCustomPanel && (
          <div className="mt-3 grid grid-cols-1 gap-2 rounded-md border p-3 md:grid-cols-[1fr_1fr_auto_auto]">
            <Input
              type="date"
              className="border-zinc-300 font-medium border-2 text-black"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
            />
            <Input
              type="date"
              className="border-zinc-300 font-medium border-2 text-black"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
            />
            <Button
              size="sm"
              onClick={applyCustomRange}
              disabled={!customFrom || !customTo || new Date(customFrom) > new Date(customTo)}
            >
              Apply
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-500 hover:bg-blue-50"
              onClick={clearCustomRange}
            >
              Use Preset
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-62.5 w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
