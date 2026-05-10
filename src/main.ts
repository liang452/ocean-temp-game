import { Application, Assets, Sprite } from "pixi.js";
import * as PIXI from "pixi.js";

import { Howl } from "howler";

enum Temp {
  Unexplored,
  Cold,
  Cool,
  Warm,
  Hot,
}

(async () => {
  // Create a new application

  // declare logs
  const Colors: Record<number, string> = {
    0: "#89CFF0",
    1: "#013220",
    2: "#228B22",
    3: "#00FF00",
    4: "#FFFF00",
  };

  const temp_logs: Temp[] = Array(10).fill(Temp.Unexplored);
  const base = import.meta.env.BASE_URL;

  // setup howler sound
  const temp_sound = new Howl({
    src: ["assets/gulf-temperature.wav"],
    sprite: {
      // [offset, duration]
      segment: [0, 800], // plays for set duration
    },
  });

  const gameState = {
    score: 0,
    level: 1,
    playerHealth: 100,
    isDone: false,
    currentArea: 0,
    logs: temp_logs,
  };

  // Saving data
  localStorage.setItem("gameSave", JSON.stringify(gameState));

  // Loading data
  // const savedState = JSON.parse(localStorage.getItem('gameSave'));

  const currentArea = gameState.currentArea;

  PIXI.TextureStyle.defaultOptions.scaleMode = "nearest";
  const app = new Application();

  // Initialize the application
  await app.init({
    roundPixels: true,
    background: "#1099bb",
    resizeTo: window,
  });

  // Append the application canvas to the document body
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  // make sprites
  const diver = new Sprite(await Assets.load(`${base}assets/diver.png`));

  const log_texture = await Assets.load(`${base}assets/log.png`);
  const scan_texture = await Assets.load(`${base}assets/scan.png`);
  const mapui_texture = await Assets.load(`${base}assets/map.png`);

  const outline = new Sprite(await Assets.load(`${base}assets/outline.png`));
  const florida = new Sprite(await Assets.load(`${base}assets/florida.png`));
  const a1 = new Sprite(await Assets.load(`${base}assets/a1.png`));
  const a2 = new Sprite(await Assets.load(`${base}assets/a2.png`));
  const a3 = new Sprite(await Assets.load(`${base}assets/a3.png`));
  const a4 = new Sprite(await Assets.load(`${base}assets/a4.png`));
  const a5 = new Sprite(await Assets.load(`${base}assets/a5.png`));
  const a6 = new Sprite(await Assets.load(`${base}assets/a6.png`));
  const a7 = new Sprite(await Assets.load(`${base}assets/a7.png`));
  const a8 = new Sprite(await Assets.load(`${base}assets/a8.png`));
  const a9 = new Sprite(await Assets.load(`${base}assets/a9.png`));

  const area_arr = [
    {
      sprite: a1,
      center: { x: 275, y: 620 },
      neighbors: [1, 2],
      temperature: Temp.Cool,
    },

    {
      sprite: a2,
      center: { x: 400, y: 645 },
      neighbors: [0, 2],
      temperature: Temp.Warm,
    },

    {
      sprite: a3,
      center: { x: 625, y: 600 },
      neighbors: [0, 2, 3, 4, 5],
      temperature: Temp.Warm,
    },
    {
      sprite: a4,
      center: { x: 475, y: 400 },
      neighbors: [2],
      temperature: Temp.Warm,
    },
    {
      sprite: a5,
      center: { x: 825, y: 575 },
      neighbors: [2, 3, 5],
      temperature: Temp.Warm,
    },
    {
      sprite: a6,
      center: { x: 825, y: 175 },
      neighbors: [2, 3, 6],
      temperature: Temp.Warm,
    },
    {
      sprite: a7,
      center: { x: 900, y: 300 },
      neighbors: [3],
      temperature: Temp.Warm,
    },
    {
      sprite: a8,
      center: { x: 975, y: 700 },
      neighbors: [4],
      temperature: Temp.Warm,
    },
    {
      sprite: a9,
      center: { x: 1075, y: 225 },
      neighbors: [7],
      temperature: Temp.Warm,
    },
  ];

  // function updateNeighbors() {
  //   for (const area of area_arr) {
  //     area.sprite.removeAllListeners("pointerdown");
  //     area.sprite.eventMode = "none";
  //   }

  //   for (const n of area_arr[currentArea].neighbors) {
  //     const sprite = area_arr[n].sprite;

  //     sprite.eventMode = "static";

  //     sprite.cursor = "pointer";

  //     sprite.on("pointerdown", (event) => {
  //       gameState.logs.push(n);
  //       currentArea = n;

  //       diver.position.set(
  //         area_arr[currentArea].center.x,
  //         area_arr[currentArea].center.y,
  //       );

  //       updateNeighbors();
  //     });
  //   }
  // }

  // updateNeighbors();

  // Create a sprites

  const log_button = new Sprite(log_texture);
  const scan_button = new Sprite(scan_texture);
  const map_button = new Sprite(mapui_texture);

  const journal_texture = await Assets.load(`${base}assets/journal.png`);
  const journal = new Sprite(journal_texture);

  // Center the sprite's anchor point & scale
  diver.anchor.set(0.5);
  outline.anchor.set(0.5);
  florida.anchor.set(0.5);

  log_button.anchor.set(0.5);
  map_button.anchor.set(0.5);
  scan_button.anchor.set(0.5);
  journal.anchor.set(0.5);

  diver.scale.set(3);
  outline.scale.set(3);
  florida.scale.set(3);
  log_button.scale.set(3);
  map_button.scale.set(3);
  scan_button.scale.set(3);

  let count = 0;
  for (const a of area_arr) {
    a.sprite.anchor.set(0.5);
    a.sprite.scale.set(3);
    a.sprite.position.set(app.screen.width / 2.25, app.screen.height / 2);

    a.sprite.tint = Colors[temp_logs[count]];
    app.stage.addChild(a.sprite);
    count += 1;
  }

  // interactions

  log_button.eventMode = "static";
  log_button.cursor = "pointer";

  // logging
  log_button.on("pointerdown", () => {
    console.log("Clicked or touched!");
    const input = window.prompt("Log the temperature from 1-4:");
    if (input != null) {
      const val = parseInt(input);
      if (val < 5 && val > 0) {
        console.log("User log:", input);
        temp_logs[currentArea] = parseInt(input);
        gameState.logs.push(parseInt(input)); // if you change Temp array later
        area_arr[currentArea].sprite.tint = Colors[val];
      }
    }
  });

  scan_button.eventMode = "static";
  scan_button.cursor = "pointer";

  scan_button.on("pointerdown", () => {
    temp_sound.play("segment");
    console.log("clicked scan");
  });

  map_button.eventMode = "static";
  map_button.cursor = "pointer";

  // Move the sprite to the center of the screen
  florida.position.set(app.screen.width / 2.25, app.screen.height / 2);

  outline.position.set(app.screen.width / 2.25, app.screen.height / 2);
  journal.position.set(app.screen.width / 2, app.screen.height / 2);

  log_button.position.set((app.screen.width * 5) / 6, app.screen.height / 4);
  map_button.position.set(
    (app.screen.width * 5) / 6,
    app.screen.height / 4 + 100,
  );
  scan_button.position.set(
    (app.screen.width * 5) / 6,
    app.screen.height / 4 + 200,
  );

  diver.position.set(
    area_arr[currentArea].center.x,
    area_arr[currentArea].center.y,
  );

  // Add the bunny to the stage
  app.stage.addChild(florida);
  app.stage.addChild(outline);
  app.stage.addChild(diver);

  app.stage.addChild(log_button);
  app.stage.addChild(map_button);
  app.stage.addChild(scan_button);

  map_button.on("pointerdown", () => {
    console.log("Clicked or touched!");
    // render the book over everything
    app.stage.addChild(journal);
  });

  // Listen for animate update
  app.ticker.add(() => {
    // * Delta is 1 if running at 100% performance *
    // * Creates frame-independent transformation *
    // diver.rotation += 0.1 * time.deltaTime;
  });
})();
