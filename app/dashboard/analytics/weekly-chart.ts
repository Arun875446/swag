// import checkDate from "./check-date";

// export const weeklyChart = (chartItems: { date: Date; revenue: number }[]) => {
//   return [
//     {
//       date: "6d ago",
//       revenue: chartItems
//         .filter((order) => checkDate(order.date, 6))
//         .reduce((acc, price) => acc + price.revenue, 0),
//     },
//     {
//       date: "5d ago",
//       revenue: chartItems
//         .filter((order) => checkDate(order.date, 5))
//         .reduce((acc, price) => acc + price.revenue, 0),
//     },
//     {
//       date: "4d ago",
//       revenue: chartItems
//         .filter((order) => checkDate(order.date, 4))
//         .reduce((acc, price) => acc + price.revenue, 0),
//     },
//     {
//       date: "3d ago",
//       revenue: chartItems
//         .filter((order) => checkDate(order.date, 3))
//         .reduce((acc, price) => acc + price.revenue, 0),
//     },
//     {
//       date: "2d ago",
//       revenue: chartItems
//         .filter((order) => checkDate(order.date, 2))
//         .reduce((acc, price) => acc + price.revenue, 0),
//     },
//     {
//       date: "1d ago",
//       revenue: chartItems
//         .filter((order) => checkDate(order.date, 1))
//         .reduce((acc, price) => acc + price.revenue, 0),
//     },
//     {
//       date: "today",
//       revenue: chartItems
//         .filter((order) => checkDate(order.date, 0))
//         .reduce((acc, price) => acc + price.revenue, 0),
//     },
//   ];
// };
import checkDate from "./check-date";

interface ChartItem {
  date: Date;
  revenue: number;
}

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

export const weeklyChart = (chartItems: ChartItem[]) => {
  const uniqueChartItems = deduplicateChartItems(chartItems);
  const days = [
    "today",
    "1d ago",
    "2d ago",
    "3d ago",
    "4d ago",
    "5d ago",
    "6d ago",
  ];

  return days.map((label, index) => {
    const filteredItems = uniqueChartItems.filter((order) =>
      checkDate(order.date, index)
    );

    // Log filtered items for debugging
    console.log(`Filtered items for ${label}:`, filteredItems);

    const revenue = filteredItems.reduce(
      (acc, order) => acc + order.revenue,
      0
    );

    return {
      date: label,
      revenue,
    };
  });
};
