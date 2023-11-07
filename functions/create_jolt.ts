import { DefineFunction, SlackFunction } from "deno-slack-sdk/mod.ts";
import { JOLT_DATASTORE } from "../datastores/jolt_data.ts";

export const CreateJoltFunction = DefineFunction({
  callback_id: "create_jolt",
  title: "Create Jolt",
  description: "Create Jolt and store it a datastore",
  source_file: "functions/create_jolt.ts", // The file with the exported function handler
  output_parameters: {
    properties: {},
    required: [],
  },
});

export default SlackFunction(CreateJoltFunction, async ({ client }) => {
  const putResponse = await client.apps.datastore.put({
    datastore: JOLT_DATASTORE,
    item: {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString().split("T")[0],
    },
  });

  if (!putResponse.ok) {
    return { error: `Failed to store run: ${putResponse.error}` };
  }
  return { outputs: {} };
});
