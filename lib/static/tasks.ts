import { Level, TaskLength, TaskType } from "../types/enums";
import { LevelTask } from "../types";

const TASKS_THE_SKELD: readonly Readonly<LevelTask>[] = [
  { id: 0, name: "Admin: Swipe Card", isVisual: false, length: TaskLength.Common, type: TaskType.SwipeCard },
  { id: 1, name: "Electrical: Fix Wiring", isVisual: false, length: TaskLength.Common, type: TaskType.FixWiring },
  { id: 2, name: "Weapons: Clear Asteroids", isVisual: true, length: TaskLength.Long, type: TaskType.ClearAsteroids },
  { id: 3, name: "Engines: Align Engine Output", isVisual: false, length: TaskLength.Short, type: TaskType.AlignEngineOutput },
  { id: 4, name: "Medbay: Submit Scan", isVisual: true, length: TaskLength.Long, type: TaskType.SubmitScan },
  { id: 5, name: "Medbay: Inspect Sample", isVisual: false, length: TaskLength.Long, type: TaskType.InspectSample },
  { id: 6, name: "Storage: Fuel Engines", isVisual: false, length: TaskLength.Long, type: TaskType.FuelEngines },
  { id: 7, name: "Reactor: Start Reactor", isVisual: false, length: TaskLength.Long, type: TaskType.StartReactor },
  { id: 8, name: "O2: Empty Chute", isVisual: true, length: TaskLength.Long, type: TaskType.EmptyChute },
  { id: 9, name: "Cafeteria: Empty Garbage", isVisual: true, length: TaskLength.Long, type: TaskType.EmptyGarbage },
  { id: 10, name: "Communications: Download Data", isVisual: false, length: TaskLength.Short, type: TaskType.UploadData },
  { id: 11, name: "Electrical: Calibrate Distributor", isVisual: false, length: TaskLength.Short, type: TaskType.CalibrateDistributor },
  { id: 12, name: "Navigation: Chart Course", isVisual: false, length: TaskLength.Short, type: TaskType.ChartCourse },
  { id: 13, name: "O2: Clean O2 Filter", isVisual: false, length: TaskLength.Short, type: TaskType.CleanOxygenFilter },
  { id: 14, name: "Reactor: Unlock Manifolds", isVisual: false, length: TaskLength.Short, type: TaskType.UnlockManifolds },
  { id: 15, name: "Electrical: Download Data", isVisual: false, length: TaskLength.Short, type: TaskType.UploadData },
  { id: 16, name: "Navigation: Stabilize Steering", isVisual: false, length: TaskLength.Short, type: TaskType.StabilizeSteering },
  { id: 17, name: "Weapons: Download Data", isVisual: false, length: TaskLength.Short, type: TaskType.UploadData },
  { id: 18, name: "Shields: Prime Shields", isVisual: true, length: TaskLength.Short, type: TaskType.PrimeShields },
  { id: 19, name: "Cafeteria: Download Data", isVisual: false, length: TaskLength.Short, type: TaskType.UploadData },
  { id: 20, name: "Navigation: Download Data", isVisual: false, length: TaskLength.Short, type: TaskType.UploadData },
  { id: 21, name: "Electrical: Divert Power to Shields", isVisual: false, length: TaskLength.Short, type: TaskType.DivertPower },
  { id: 22, name: "Electrical: Divert Power to Weapons", isVisual: false, length: TaskLength.Short, type: TaskType.DivertPower },
  { id: 23, name: "Electrical: Divert Power to Communications", isVisual: false, length: TaskLength.Short, type: TaskType.DivertPower },
  { id: 24, name: "Electrical: Divert Power to Upper Engine", isVisual: false, length: TaskLength.Short, type: TaskType.DivertPower },
  { id: 25, name: "Electrical: Divert Power to O2", isVisual: false, length: TaskLength.Short, type: TaskType.DivertPower },
  { id: 26, name: "Electrical: Divert Power to Navigation", isVisual: false, length: TaskLength.Short, type: TaskType.DivertPower },
  { id: 27, name: "Electrical: Divert Power to Lower Engine", isVisual: false, length: TaskLength.Short, type: TaskType.DivertPower },
  { id: 28, name: "Electrical: Divert Power to Security", isVisual: false, length: TaskLength.Short, type: TaskType.DivertPower },
];

const TASKS_MIRA_HQ: readonly Readonly<LevelTask>[] = [
  { id: 0, name: "Hallway: Fix Wiring", isVisual: false, length: TaskLength.Common, type: TaskType.FixWiring },
  { id: 1, name: "Admin: Enter ID Code", isVisual: false, length: TaskLength.Common, type: TaskType.EnterIdCode },
  { id: 2, name: "Medbay: Submit Scan", isVisual: true, length: TaskLength.Long, type: TaskType.SubmitScan },
  { id: 3, name: "Balcony: Clear Asteroids", isVisual: false, length: TaskLength.Long, type: TaskType.ClearAsteroids },
  { id: 4, name: "Electrical: Divert Power to Admin", isVisual: false, length: TaskLength.Short, type: TaskType.DivertPower },
  { id: 5, name: "Electrical: Divert Power to Cafeteria", isVisual: false, length: TaskLength.Short, type: TaskType.DivertPower },
  { id: 6, name: "Electrical: Divert Power to Communications", isVisual: false, length: TaskLength.Short, type: TaskType.DivertPower },
  { id: 7, name: "Electrical: Divert Power to Launchpad", isVisual: false, length: TaskLength.Short, type: TaskType.DivertPower },
  { id: 8, name: "Electrical: Divert Power to Medbay", isVisual: false, length: TaskLength.Short, type: TaskType.DivertPower },
  { id: 9, name: "Electrical: Divert Power to Office", isVisual: false, length: TaskLength.Short, type: TaskType.DivertPower },
  { id: 10, name: "Storage: Water Plants", isVisual: false, length: TaskLength.Long, type: TaskType.WaterPlants },
  { id: 11, name: "Reactor: Start Reactor", isVisual: false, length: TaskLength.Long, type: TaskType.StartReactor },
  { id: 12, name: "Electrical: Divert Power to Greenhouse", isVisual: false, length: TaskLength.Short, type: TaskType.DivertPower },
  { id: 13, name: "Admin: Chart Course", isVisual: false, length: TaskLength.Short, type: TaskType.ChartCourse },
  { id: 14, name: "Greenhouse: Clean O2 Filter", isVisual: false, length: TaskLength.Short, type: TaskType.CleanOxygenFilter },
  { id: 15, name: "Launchpad: Fuel Engines", isVisual: false, length: TaskLength.Short, type: TaskType.FuelEngines },
  { id: 16, name: "Laboratory: Assemble Artifact", isVisual: false, length: TaskLength.Short, type: TaskType.AssembleArtifact },
  { id: 17, name: "Laboratory: Sort Samples", isVisual: false, length: TaskLength.Short, type: TaskType.SortSamples },
  { id: 18, name: "Admin: Prime Shields", isVisual: false, length: TaskLength.Short, type: TaskType.PrimeShields },
  { id: 19, name: "Cafeteria: Empty Garbage", isVisual: false, length: TaskLength.Short, type: TaskType.EmptyGarbage },
  { id: 20, name: "Balcony: Measure Weather", isVisual: false, length: TaskLength.Short, type: TaskType.MeasureWeather },
  { id: 21, name: "Electrical: Divert Power to Laboratory", isVisual: false, length: TaskLength.Short, type: TaskType.DivertPower },
  { id: 22, name: "Cafeteria: Buy Beverage", isVisual: false, length: TaskLength.Short, type: TaskType.BuyBeverage },
  { id: 23, name: "Office: Process Data", isVisual: false, length: TaskLength.Short, type: TaskType.ProcessData },
  { id: 24, name: "Launchpad: Run Diagnostics", isVisual: false, length: TaskLength.Long, type: TaskType.RunDiagnostics },
  { id: 25, name: "Reactor: Unlock Manifolds", isVisual: false, length: TaskLength.Short, type: TaskType.UnlockManifolds },
];

const TASKS_POLUS: readonly Readonly<LevelTask>[] = [
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
  { id: 21, name: "Specimen Room: Store Artifacts", isVisual: false, length: TaskLength.Short, type: TaskType.StoreArtifacts },
  { id: 22, name: "O2: Fill Canisters", isVisual: false, length: TaskLength.Short, type: TaskType.FillCanisters },
  { id: 23, name: "O2: Empty Garbage", isVisual: false, length: TaskLength.Short, type: TaskType.EmptyGarbage },
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

const TASKS_AIRSHIP: readonly Readonly<LevelTask>[] = [
  // TODO
];

export class Tasks {
  static forSkeld(): readonly Readonly<LevelTask>[] {
    return TASKS_THE_SKELD;
  }

  static forMiraHq(): readonly Readonly<LevelTask>[] {
    return TASKS_MIRA_HQ;
  }

  static forPolus(): readonly Readonly<LevelTask>[] {
    return TASKS_POLUS;
  }

  static forAirship(): readonly Readonly<LevelTask>[] {
    return TASKS_AIRSHIP;
  }

  static forLevel(level: Level): readonly Readonly<LevelTask>[] {
    switch (level) {
      case Level.TheSkeld:
      case Level.AprilSkeld:
        return this.forSkeld();
      case Level.MiraHq:
        return this.forMiraHq();
      case Level.Polus:
        return this.forPolus();
      case Level.Airship:
        return this.forAirship();
    }
  }

  static forSkeldFromId(ids: number[]): readonly Readonly<LevelTask>[] {
    return this.forSkeld().filter(t => ids.includes(t.id));
  }

  static forMiraHqFromId(ids: number[]): readonly Readonly<LevelTask>[] {
    return this.forMiraHq().filter(t => ids.includes(t.id));
  }

  static forPolusFromId(ids: number[]): readonly Readonly<LevelTask>[] {
    return this.forPolus().filter(t => ids.includes(t.id));
  }

  static forAirshipFromId(ids: number[]): readonly Readonly<LevelTask>[] {
    return this.forAirship().filter(t => ids.includes(t.id));
  }

  static forLevelFromId(level: Level, ids: number[]): readonly Readonly<LevelTask>[] {
    switch (level) {
      case Level.TheSkeld:
      case Level.AprilSkeld:
        return this.forSkeldFromId(ids);
      case Level.MiraHq:
        return this.forMiraHqFromId(ids);
      case Level.Polus:
        return this.forPolusFromId(ids);
      case Level.Airship:
        return this.forAirshipFromId(ids);
    }
  }
}
