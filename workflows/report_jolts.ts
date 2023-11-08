import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { GetJoltReportFunction } from "../functions/get_jolt_report.ts";

const ReportJoltsWorkflow = DefineWorkflow({
  callback_id: "report_jolts_workflow",
  title: "Report Jolts",
  description: "Report Jolts given during a time period",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      channel_id: {
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["interactivity", "channel_id"],
  },
});

const QueryJolts = ReportJoltsWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Report Jolts",
    interactivity: ReportJoltsWorkflow.inputs.interactivity,
    submit_label: "Share",
    description:
      "Create and a share a report of Jolts given during a time period",
    fields: {
      elements: [
        {
          name: "channel",
          title: "Where should this message be shared?",
          type: Schema.slack.types.channel_id,
          default: ReportJoltsWorkflow.inputs.channel_id,
        },
        {
          name: "report_time_period",
          title: "Report time period",
          type: Schema.types.string,
          enum: [
            "This week",
            "This month",
            "This year",
          ],
          default: "This week",
        },
      ],
      required: ["channel", "report_time_period"],
    },
  },
);

const { outputs: { count } } = ReportJoltsWorkflow.addStep(
  GetJoltReportFunction,
  {
    time_period: QueryJolts.outputs.fields.report_time_period,
  },
);

ReportJoltsWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: QueryJolts.outputs.fields.channel,
  message: `Report test ${count}`,
});

export { ReportJoltsWorkflow };
