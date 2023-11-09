import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { JOLT_DATASTORE } from "../datastores/jolt_data.ts";

export const GetJoltReportFunction = DefineFunction({
  callback_id: "get_jolt_report",
  title: "Get Jolt report",
  description: "Returns the count of Jolts given during a timeperiod",
  source_file: "functions/get_jolt_report.ts",
  input_parameters: {
    properties: {
      time_period: {
        type: Schema.types.string,
        description: "The report period",
      },
    },
    required: ["time_period"],
  },
  output_parameters: {
    properties: {
      count: {
        type: Schema.types.number,
        description: "Count of the Jolts",
      },
    },
    required: ["count"],
  },
});

const formatStartAndEndDate = ({ start, end }: { start: Date; end: Date }) => {
  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  };
};

const getThisYearStartAndEnd = () => {
  const today = new Date();
  const firstDayOfYear = new Date(Date.UTC(today.getFullYear(), 0, 1));
  const lastDayOfYear = new Date(Date.UTC(today.getFullYear(), 11, 31));

  return formatStartAndEndDate({ start: firstDayOfYear, end: lastDayOfYear });
};

const getThisMonthStartAndEnd = () => {
  const today = new Date();
  const lastDayOfMonth = new Date(
    Date.UTC(today.getFullYear(), today.getMonth() + 1, 0),
  );
  const firstDayOfMonth = new Date(today.setDate(1));

  return formatStartAndEndDate({ start: firstDayOfMonth, end: lastDayOfMonth });
};

const getThisWeekStartAndEnd = () => {
  const today = new Date();
  const first = today.getDate() - today.getDay() + 1;

  const firstDayOfWeek = new Date(today.setDate(first));
  const lastDayOfWeek = new Date(today.setDate(firstDayOfWeek.getDate() + 6));

  return formatStartAndEndDate({ start: firstDayOfWeek, end: lastDayOfWeek });
};

export default SlackFunction(
  GetJoltReportFunction,
  async ({ inputs, client }) => {
    const { start, end } = inputs.time_period === "This year"
      ? getThisYearStartAndEnd()
      : inputs.time_period === "This month"
      ? getThisMonthStartAndEnd()
      : getThisWeekStartAndEnd();

    const queryResponse = await client.apps.datastore.query({
      datastore: JOLT_DATASTORE,
      expression: "created_at BETWEEN :start AND :end",
      expression_values: {
        ":start": start,
        ":end": end,
      },
    });

    if (!queryResponse.ok) {
      return { error: `Failed to store run: ${queryResponse.error}` };
    }

    return {
      outputs: {
        count: queryResponse.items.length,
      },
    };
  },
);
