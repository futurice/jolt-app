import { Manifest } from "deno-slack-sdk/mod.ts";
import JoltDatastore from "./datastores/jolt_data.ts";
import { CreateJoltFunction } from "./functions/create_jolt.ts";
import { Jolt } from "./types/jolt.ts";
import { GiveJoltWorkflow } from "./workflows/give_jolt.ts";
import { ReportJoltsWorkflow } from "./workflows/report_jolts.ts";

export default Manifest({
  name: "Jolt App",
  description: "Brighten someone's day with a heartfelt thank you",
  icon: "assets/icon.png",
  functions: [CreateJoltFunction],
  workflows: [GiveJoltWorkflow, ReportJoltsWorkflow],
  datastores: [JoltDatastore],
  types: [Jolt],
  outgoingDomains: [],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "datastore:write",
    "datastore:read",
  ],
});
