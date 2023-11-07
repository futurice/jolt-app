import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { GetJoltReportFunction } from "../functions/get_jolt_report.ts";

const ReportJoltsWorkflow = DefineWorkflow({
  callback_id: "report_jolts_workflow",
  title: "Report Jolts",
  description: "Report Jolts", // TODO More descriptive
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
    description: "Report Jolts", // TODO More descriptive
    fields: {
      elements: [
        {
          name: "channel",
          title: "Where should this message be shared?",
          type: Schema.slack.types.channel_id,
          default: ReportJoltsWorkflow.inputs.channel_id,
        },
        {
          name: "report_period",
          title: "Report period",
          description: "Report period", // TODO More descriptive
          type: Schema.types.string,
          enum: [
            "This week",
            "This month",
            "This year",
          ],
          default: "This week",
        },
      ],
      required: ["channel", "report_period"],
    },
  },
);

const { outputs: { count } } = ReportJoltsWorkflow.addStep(
  GetJoltReportFunction,
  {
    period: QueryJolts.outputs.fields.report_period,
  },
);

ReportJoltsWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: QueryJolts.outputs.fields.channel,
  message: `Report test ${count}`,
});

export { ReportJoltsWorkflow };
