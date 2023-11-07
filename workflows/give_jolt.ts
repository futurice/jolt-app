import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";

/**
 * A workflow is a set of steps that are executed in order. Each step in a
 * workflow is a function – either a built-in or custom function.
 * Learn more: https://api.slack.com/automation/workflows
 */
const GiveJoltWorkflow = DefineWorkflow({
  callback_id: "give_jolt_workflow",
  title: "Give jolt",
  description: "Acknowledge the impact someone had on you",
  input_parameters: {
    properties: {
      /**
       * This workflow users interactivity to collect input from the user.
       * Learn more: https://api.slack.com/automation/forms#add-interactivity
       */
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      channel_id: {
        type: Schema.slack.types.channel_id,
      },
      user_id: {
        type: Schema.slack.types.user_id,
      },
    },
    required: ["interactivity", "channel_id", "user_id"],
  },
});

/**
 * Collecting input from users can be done with the built-in OpenForm function
 * as the first step.
 * Learn more: https://api.slack.com/automation/functions#open-a-form
 */
const jolt = GiveJoltWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Give someone a jolt",
    interactivity: GiveJoltWorkflow.inputs.interactivity,
    submit_label: "Share",
    description: "Continue the positive energy through your written word",
    fields: {
      elements: [
        {
          name: "channel",
          title: "Where should this message be shared?",
          type: Schema.slack.types.channel_id,
          default: GiveJoltWorkflow.inputs.channel_id,
        },
        {
          name: "jolt_to",
          title: "Whose deeds are deemed worthy of a jolt?",
          type: Schema.slack.types.user_id,
        },
        {
          name: "message",
          title: "What would you like to say?",
          type: Schema.types.string,
          long: true,
        },
      ],
      required: ["jolt_to", "channel", "message"],
    },
  },
);

/**
 * Messages can be sent into a channel with the built-in SendMessage function.
 * Learn more: https://api.slack.com/automation/functions#catalog
 */
GiveJoltWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: jolt.outputs.fields.channel,
  message:
    `:brand_colors_jolt: <@${jolt.outputs.fields.jolt_to}> has received a Jolt from <@${GiveJoltWorkflow.inputs.user_id}>! :brand_colors_jolt:\n` +
    `> ${jolt.outputs.fields.message}\n`,
});

export { GiveJoltWorkflow };
