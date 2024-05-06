import alt from "alt-client";
import native from "natives";
import { screenToWorld } from "./ScreenToWorld/ScreenToWorld.js";

type Listener = {
  cb: Function;
  label: string;
  id: number;
  player?: boolean;
  entity?: alt.Entity;
  vehicle?: boolean;
  model?: string | number;
  icon?: string;
  distance?: number;
  disabled?: (entity: alt.Entity) => boolean;
  visible?: (entity: alt.Entity) => boolean;
};

type Item = {
  label: string;
  id: number;
  icon?: string;
  entity: number;
  disabled: boolean;
};

let listeners: Listener[] = [];
let disabled = 0;
let canClose = 0;

const view = new alt.WebView("http://resource/client/webview/dist/index.html");

view.isVisible = false;

view.on("close", () => {
  if (!view.isVisible) return;

  close();
});

alt.on("keydown", (key) => {
  if (key !== 1 || !view.isReady || view.isVisible || !alt.isCursorVisible() || disabled !== 0) return;

  const coords = screenToWorld();
  const coords2 = alt.screenToWorld(alt.getCursorPos());

  const handle = native.startShapeTestLosProbe(coords2.x, coords2.y, coords2.z, coords.x, coords.y, coords.z, -1, 0, 4);

  const everyTick = alt.everyTick(() => {
    const [retval, hit, endCoords, surfaceNormal, materialHash, entityHit] =
      native.getShapeTestResultIncludingMaterial(handle);

    if (retval !== 1) {
      alt.clearEveryTick(everyTick);

      if (!hit) return;

      handleClick(entityHit);
    }
  });
});

function handleClick(entityHit: number) {
  if (view.isVisible) return;

  const entity = alt.Entity.getByScriptID(entityHit);
  if (!entity || !entity.valid || !entity.isSpawned) return;

  const items: Item[] = [];

  listeners.forEach((listener) => {
    if (alt.Player.local.pos.distanceTo(entity.pos) > (listener.distance ?? 1.0)) return;

    if (listener.visible && !listener.visible(entity)) return;

    let disabled = false;

    if (listener.disabled && listener.disabled(entity)) disabled = true;

    if (listener.entity && listener.entity === entity)
      return items.push({
        label: listener.label,
        id: listener.id,
        icon: listener.icon,
        entity: entity.scriptID,
        disabled,
      });

    if (listener.model && native.getHashKey(listener.model.toString()) === entity.model)
      return items.push({
        label: listener.label,
        id: listener.id,
        icon: listener.icon,
        entity: entity.scriptID,
        disabled,
      });

    if (listener.player && entity.type === alt.BaseObjectType.Player)
      return items.push({
        label: listener.label,
        id: listener.id,
        icon: listener.icon,
        entity: entity.scriptID,
        disabled,
      });

    if (listener.vehicle && entity.type === alt.BaseObjectType.Vehicle)
      return items.push({
        label: listener.label,
        id: listener.id,
        icon: listener.icon,
        entity: entity.scriptID,
        disabled,
      });
  });

  if (items.length === 0) return;

  open(items);
}

alt.on("keydown", (key: alt.KeyCode) => {
  if (key !== alt.KeyCode.M || disabled !== 0) return;

  const current = alt.isCursorVisible();

  if (current) return close();

  alt.showCursor(true);
  alt.toggleGameControls(false);
});

view.on("select", (id, entityId) => {
  const listener = listeners.find((x) => x.id === id);

  if (listener) {
    const entity = alt.Entity.getByScriptID(entityId);

    if (entity && entity.valid) listener.cb({ ...listener, entity });
  }

  close();
});

export function onClick(data: Omit<Listener, "id">) {
  const id = listeners.length === 0 ? 0 : listeners[listeners.length - 1].id + 1;

  listeners.push({
    ...data,
    id,
  });

  return id;
}

export function offClick(id: number) {
  const index = listeners.findIndex((x) => x.id === id);

  listeners.splice(index, 1);
}

function close() {
  view.isVisible = false;
  view.unfocus();
  view.emit("setItems", []);
  alt.showCursor(false);
  alt.toggleGameControls(true);
}

function open(items: Item[]) {
  view.emit("setItems", items);
  view.emit("setPos", alt.getCursorPos());

  alt.setTimeout(() => {
    view.focus();
    view.isVisible = true;
  }, 100);
}

export function disable(state: boolean) {
  if (state) disabled++;
  else disabled--;

  if (disabled > 0 && view.isVisible) close();

  if (disabled < 0) {
    disabled = 0;
    throw Error("Cursor");
  }
}

export function isVisible() {
  return alt.isCursorVisible();
}
