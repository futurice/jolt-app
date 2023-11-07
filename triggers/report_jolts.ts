import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import { ReportJoltsWorkflow } from "../workflows/report_jolts.ts";

const trigger: Trigger<typeof ReportJoltsWorkflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: "Report Jolts",
  description: "Report Jolts", // TODO More descriptive
  workflow: `#/workflows/${ReportJoltsWorkflow.definition.callback_id}`,
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
    channel_id: {
      value: TriggerContextData.Shortcut.channel_id,
    },
  },
};

export default trigger;
