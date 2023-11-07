import { DefineType, Schema } from "deno-slack-sdk/mod.ts";

export const Jolt = DefineType({
  title: "Jolt",
  description: "Information about the jolt",
  name: "jolt",
  type: Schema.types.object,
  properties: {
    created_at: { type: Schema.slack.types.date },
  },
  required: ["created_at"],
});
