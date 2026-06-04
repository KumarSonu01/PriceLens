import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const PriceHistoryChart = ({
  data,
}) => {
  const formattedData =
    data.map((item) => ({
      price: item.price,

      date: new Date(
        item.createdAt
      ).toLocaleDateString(),
    }));

  const lowestPrice =
    formattedData.length > 0
      ? Math.min(
          ...formattedData.map(
            (item) =>
              item.price
          )
        )
      : 0;

  const highestPrice =
    formattedData.length > 0
      ? Math.max(
          ...formattedData.map(
            (item) =>
              item.price
          )
        )
      : 0;

  const currentPrice =
    formattedData.length > 0
      ? formattedData[
          formattedData.length -
            1
        ].price
      : 0;

  const averagePrice =
    formattedData.length > 0
      ? Math.round(
          formattedData.reduce(
            (
              total,
              item
            ) =>
              total +
              item.price,
            0
          ) /
            formattedData.length
        )
      : 0;

  const firstPrice =
    formattedData[0]?.price ||
    0;

  const priceChange =
    formattedData.length > 1 &&
    firstPrice > 0
      ? (
          ((currentPrice -
            firstPrice) /
            firstPrice) *
          100
        ).toFixed(1)
      : 0;

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
        <div>
          <h2 className="text-2xl font-bold">
            Price History
          </h2>

          <p className="text-gray-500 mt-1">
            Historical price
            trend
          </p>

          <p
            className={`font-semibold mt-2 ${
              Number(
                priceChange
              ) >= 0
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {Number(
              priceChange
            ) >= 0
              ? `↑ ${priceChange}%`
              : `↓ ${Math.abs(
                  priceChange
                )}%`}
            {" "}
            from first
            recorded price
          </p>
        </div>

        <div className="text-sm text-gray-500">
          {
            formattedData.length
          }{" "}
          Records
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-green-100 text-green-700 rounded-xl p-4">
          <p className="text-sm font-medium">
            Current Price
          </p>

          <h3 className="text-2xl font-bold mt-1">
            ₹
            {currentPrice.toLocaleString()}
          </h3>
        </div>

        <div className="bg-blue-100 text-blue-700 rounded-xl p-4">
          <p className="text-sm font-medium">
            Average Price
          </p>

          <h3 className="text-2xl font-bold mt-1">
            ₹
            {averagePrice.toLocaleString()}
          </h3>
        </div>

        <div className="bg-green-100 text-green-700 rounded-xl p-4">
          <p className="text-sm font-medium">
            Lowest Price
          </p>

          <h3 className="text-2xl font-bold mt-1">
            ₹
            {lowestPrice.toLocaleString()}
          </h3>
        </div>

        <div className="bg-red-100 text-red-700 rounded-xl p-4">
          <p className="text-sm font-medium">
            Highest Price
          </p>

          <h3 className="text-2xl font-bold mt-1">
            ₹
            {highestPrice.toLocaleString()}
          </h3>
        </div>
      </div>

      {formattedData.length ===
      0 ? (
        <div className="h-[350px] flex items-center justify-center text-gray-500 text-lg">
          No price history
          available
        </div>
      ) : (
        <div className="w-full h-[350px] min-w-0">
          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <LineChart
              data={
                formattedData
              }
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="date"
              />

              <YAxis
                domain={[
                  (
                    dataMin
                  ) =>
                    Math.floor(
                      dataMin *
                        0.95
                    ),
                  (
                    dataMax
                  ) =>
                    Math.ceil(
                      dataMax *
                        1.05
                    ),
                ]}
              />

              <Tooltip
                formatter={(
                  value
                ) =>
                  `₹${Number(
                    value
                  ).toLocaleString()}`
                }
              />

              <Line
                type="monotone"
                dataKey="price"
                stroke="#16a34a"
                strokeWidth={3}
                dot={{
                  r: 5,
                }}
                activeDot={{
                  r: 8,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default PriceHistoryChart;