import { TaskType } from "./taskType";

export enum TaskLength {
  Common,
  Short,
  Long,
}

export type LevelTask = {
  id: number;
  name: string;
  length: TaskLength;
  isVisual: boolean;
  type: TaskType;
};

export const THE_SKELD: LevelTask[] = [
  // TODO: Cody
];

export const MIRA_HQ: LevelTask[] = [
  // TODO: Cody
];

export const POLUS: LevelTask[] = [
  { id: 0, name: "Office: Swipe Card", isVisual: false, length: TaskLength.Common, type: TaskType.SwipeCard },
  { id: 1, name: "Dropship: Insert Keys", isVisual: false, length: TaskLength.Common, type: TaskType.InsertKeys },
  { id: 2, name: "Office: Scan Boarding Pass", isVisual: false, length: TaskLength.Common, type: TaskType.ScanBoardingPass },
  { id: 3, name: "Electrical: Fix Wiring", isVisual: false, length: TaskLength.Common, type: TaskType.FixWiring },
  { id: 4, name: "Weapons: Download Data", isVisual: false, length: TaskLength.Short, type: TaskType.UploadData },
  { id: 5, name: "Office: Download Data", isVisual: false, length: TaskLength.Short, type: TaskType.UploadData },
  { id: 6, name: "Electrical: Download Data", isVisual: false, length: TaskLength.Short, type: TaskType.UploadData },
  { id: 7, name: "Specimen Room: Download Data", isVisual: false, length: TaskLength.Short, type: TaskType.UploadData },
  { id: 8, name: "O2: Download Data", isVisual: false, length: TaskLength.Short, type: TaskType.UploadData },
  { id: 9, name: "Specimen Room: Start Reactor", isVisual: false, length: TaskLength.Long, type: TaskType.StartReactor },
  { id: 10, name: "Storage: Fuel Engines", isVisual: false, length: TaskLength.Long, type: TaskType.FuelEngines },
  { id: 11, name: "Boiler Room: Open Waterways", isVisual: false, length: TaskLength.Long, type: TaskType.OpenWaterways },
  { id: 12, name: "Medbay: Inspect Sample", isVisual: false, length: TaskLength.Long, type: TaskType.InspectSample },
  { id: 13, name: "Boiler Room: Replace Water Jug", isVisual: false, length: TaskLength.Long, type: TaskType.ReplaceWaterJug },
  { id: 14, name: "Outside: Fix Weather Node Node_GI", isVisual: false, length: TaskLength.Long, type: TaskType.ActivateWeatherNodes },
  { id: 15, name: "Outside: Fix Weather Node Node_IRO", isVisual: false, length: TaskLength.Long, type: TaskType.ActivateWeatherNodes },
  { id: 16, name: "Outside: Fix Weather Node Node_PD", isVisual: false, length: TaskLength.Long, type: TaskType.ActivateWeatherNodes },
  { id: 17, name: "Outside: Fix Weather Node Node_TB", isVisual: false, length: TaskLength.Long, type: TaskType.ActivateWeatherNodes },
  { id: 18, name: "Communications: Reboot WiFi", isVisual: false, length: TaskLength.Long, type: TaskType.RebootWifi },
  { id: 19, name: "O2: Monitor Tree", isVisual: false, length: TaskLength.Short, type: TaskType.MonitorOxygen },
  { id: 20, name: "Specimen Room: Unlock Manifolds", isVisual: false, length: TaskLength.Short, type: TaskType.UnlockManifolds },
  { id: 21, name: "Specimen Room: Store Artifacts", isVisual: false, length: TaskLength.Short, type: TaskType.StoreArtifact },
  { id: 22, name: "O2 Fill Canisters", isVisual: false, length: TaskLength.Short, type: TaskType.FillCanisters },
  { id: 23, name: "O2 Empty Garbage", isVisual: false, length: TaskLength.Short, type: TaskType.EmptyGarbage },
  { id: 24, name: "Dropship: Chart Course", isVisual: false, length: TaskLength.Short, type: TaskType.ChartCourse },
  { id: 25, name: "Medbay: Submit Scan", isVisual: true, length: TaskLength.Short, type: TaskType.SubmitScan },
  { id: 26, name: "Weapons: Clear Asteroids", isVisual: true, length: TaskLength.Short, type: TaskType.ClearAsteroids },
  { id: 27, name: "Outside: Fix Weather Node Node_CA", isVisual: false, length: TaskLength.Long, type: TaskType.ActivateWeatherNodes },
  { id: 28, name: "Outside: Fix Weather Node Node_MLG", isVisual: false, length: TaskLength.Long, type: TaskType.ActivateWeatherNodes },
  { id: 29, name: "Laboratory: Align Telescope", isVisual: false, length: TaskLength.Short, type: TaskType.AlignTelescope },
  { id: 30, name: "Laboratory: Repair Drill", isVisual: false, length: TaskLength.Short, type: TaskType.RepairDrill },
  { id: 31, name: "Laboratory: Record Temperature", isVisual: false, length: TaskLength.Short, type: TaskType.RecordTemperature },
  { id: 32, name: "Outside: Record Temperature", isVisual: false, length: TaskLength.Short, type: TaskType.RecordTemperature },
];
