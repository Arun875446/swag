// import betweenWeeks from "./between-weeks";

// export const monthlyChart = (chartItems: { date: Date; revenue: number }[]) => {
//   return [
//     {
//       date: "3 weeks ago",
//       revenue: chartItems
//         .filter((order) => betweenWeeks(order.date!, 28, 21))
//         .reduce((acc, price) => acc + price.revenue, 0),
//     },
//     {
//       date: "2 weeks ago",
//       revenue: chartItems
//         .filter((order) => betweenWeeks(order.date!, 21, 14))
//         .reduce((acc, price) => acc + price.revenue, 0),
//     },
//     {
//       date: "1 week ago",
//       revenue: chartItems
//         .filter((order) => betweenWeeks(order.date!, 14, 7))
//         .reduce((acc, price) => acc + price.revenue, 0),
//     },
//     {
//       date: "this week",
//       revenue: chartItems
//         .filter((order) => betweenWeeks(order.date!, 7, 0))
//         .reduce((acc, price) => acc + price.revenue, 0),
//     },
//   ];
// };

import betweenWeeks from "./between-weeks";

interface ChartItem {
  date: Date;
  revenue: number;
}

// Function to deduplicate chart items based on date and revenue
const deduplicateChartItems = (chartItems: ChartItem[]): ChartItem[] => {
  const uniqueItems = new Map<string, ChartItem>();
  chartItems.forEach((item) => {
    const key = item.date.toISOString() + item.revenue; // create a unique key for each item
    if (!uniqueItems.has(key)) {
      uniqueItems.set(key, item);
    }
  });
  return Array.from(uniqueItems.values());
};

export const monthlyChart = (chartItems: ChartItem[]) => {
  const uniqueChartItems = deduplicateChartItems(chartItems);

  const periods = [
    { label: "3 weeks ago", start: 28, end: 21 },
    { label: "2 weeks ago", start: 21, end: 14 },
    { label: "1 week ago", start: 14, end: 7 },
    { label: "this week", start: 7, end: 0 },
  ];

  return periods.map((period) => {
    const filteredItems = uniqueChartItems.filter((order) =>
      betweenWeeks(order.date, period.start, period.end)
    );

    // Log filtered items for debugging
    console.log(`Filtered items for ${period.label}:`, filteredItems);

    const revenue = filteredItems.reduce(
      (acc, order) => acc + order.revenue,
      0
    );

    return {
      date: period.label,
      revenue,
    };
  });
};
