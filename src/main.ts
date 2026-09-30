import type { CanvasAddonMountContext } from "../generated/mywallpaper-runtime";
import { drawing } from "./drawing";
import "./style.css";
function seeded(seed: number) {
  let state = seed | 0;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4294967296;
  };
}

export function mount(context: CanvasAddonMountContext) {
  let values = context.layer.settings.get();
  const view = drawing(
    context,
    "Des nuages doux qui traversent lentement un ciel profond.",
    (g, w, h, t) => {
      g.fillStyle = String(values.sky ?? "#152831");
      g.fillRect(0, 0, w, h);
      const rng = seeded(4589),
        color = String(values.cloud ?? "#97aaa9"),
        coverage = Number(values.coverage ?? 45) / 100,
        speed = Number(values.speed ?? 1);
      for (let i = 0; i < 20; i++) {
        const x = ((rng() * w * 1.8 + t * speed * 3) % (w * 1.8)) - w * 0.4,
          y = h * (0.15 + rng() * 0.75),
          rx = w * (0.08 + rng() * 0.12),
          ry = h * (0.06 + rng() * 0.1);
        g.save();
        g.translate(x, y);
        g.scale(rx, ry);
        g.globalAlpha = coverage * 0.45;
        const grad = g.createRadialGradient(-0.2, -0.3, 0, 0, 0, 1);
        grad.addColorStop(0, color);
        grad.addColorStop(1, color + "00");
        g.fillStyle = grad;
        g.fillRect(-1, -1, 2, 2);
        g.restore();
      }
    },
  );
  const update = (next: typeof values) => {
    values = next;
    view.invalidate(next.motion !== false);
  };
  update(values);
  const stop = context.layer.settings.subscribe(update);
  return () => {
    stop();
    view.dispose();
  };
}
