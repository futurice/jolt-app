import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

export const JOLT_DATASTORE = "jolt_datastore";

const JoltDatastore = DefineDatastore({
  name: JOLT_DATASTORE,
  primary_key: "id",
  attributes: {
    id: {
      type: Schema.types.string,
    },
    created_at: {
      type: Schema.slack.types.date,
    },
  },
});

export default JoltDatastore;
