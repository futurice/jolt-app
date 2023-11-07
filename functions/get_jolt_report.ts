import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { JOLT_DATASTORE } from "../datastores/jolt_data.ts";

export const GetJoltReportFunction = DefineFunction({
  callback_id: "get_jolt_report",
  title: "Get Jolt report",
  description: "Get Jolt report", // TODO More descriptive
  source_file: "functions/get_jolt_report.ts",
  input_parameters: {
    properties: {
      period: {
        type: Schema.types.string,
        description: "The report period",
      },
    },
    required: ["period"],
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

export default SlackFunction(GetJoltReportFunction, async ({ client }) => {
  const queryResponse = await client.apps.datastore.query({
    datastore: JOLT_DATASTORE,
    expression: "created_at BETWEEN :start AND :end",
    expression_values: {
      ":start": "2023-11-01",
      ":end": "2023-11-30",
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
});
