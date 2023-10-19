import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import { GiveJoltWorkflow } from "../workflows/give_jolt.ts";

/**
 * Triggers determine when workflows are executed. A trigger file describes a
 * scenario in which a workflow should be run, such as a user clicking a link.
 * Learn more: https://api.slack.com/automation/triggers/link
 */
const trigger: Trigger<typeof GiveJoltWorkflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: "Give a jolt to someone",
  description: "Broadcast your appreciation with kind words",
  workflow: `#/workflows/${GiveJoltWorkflow.definition.callback_id}`,
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
  },
};

export default trigger;
