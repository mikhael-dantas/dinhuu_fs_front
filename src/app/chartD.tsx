"use client"
import React from "react"
import ApexChart from "react-apexcharts"
import { parseISO, format } from "date-fns"

interface DataPoint {
  name: string
  date: string // Assumindo formato ISO YYYY-MM-DD
}

interface DualChartProps {
  data: DataPoint[]
  colors: string[]
  title: string
}

const DualChart: React.FC<DualChartProps> = ({ data, colors, title }) => {
  // Processamento dos dados para o gráfico de linha
  const lineChartData = data.map((d) => {
    return {
      x: new Date(d.date),
      y: d.name,
    }
  })

  // Processamento dos dados para o gráfico de barras
  const barChartData = data.reduce((acc, d) => {
    acc[d.name] = (acc[d.name] || 0) + 1
    return acc
  }, {} as { [key: string]: number })

  const barSeries = [
    {
      name: "Quantidade",
      data: Object.entries(barChartData).map(([name, count]) => ({ x: name, y: count })),
    },
  ]

  return (
    <div className="flex flex-col w-full p-10 justify-center">
      <h2 className="text-lg font-semibold">{title}</h2>
      <ApexChart
        type="bar"
        series={barSeries}
        options={{
          chart: { type: "bar" },
          colors: colors,
          xaxis: { type: "category" },
          yaxis: { title: { text: "Quantidade" } },
        }}
        height={350}
      />
    </div>
  )
}

export default DualChart
