var iconStuff = null;

(() => {
  const GDBROWSER_ORIGIN = "https://gdbrowser.com";
  const ICONS_API = `${GDBROWSER_ORIGIN}/api/icons`;
  const nativeFetch = window.fetch.bind(window);
  const renderedIconCache = new Map();
  let iconStuffPromise;
  let iconCanvas;
  let iconRenderer;
  let renderQueue = Promise.resolve();

  window.fetch = (input, init) => {
    if (typeof input === "string" && input.startsWith("/iconkit/")) {
      return nativeFetch(`${GDBROWSER_ORIGIN}${input}`, init);
    }
    return nativeFetch(input, init);
  };

  if (window.PIXI?.Assets && !window.PIXI.Assets.__gdbrowserRemotePatched) {
    const pixiLoad = window.PIXI.Assets.load.bind(window.PIXI.Assets);
    window.PIXI.Assets.load = (source, ...rest) => {
      if (typeof source === "string" && source.startsWith("/iconkit/")) {
        return pixiLoad(`${GDBROWSER_ORIGIN}${source}`, ...rest);
      }
      return pixiLoad(source, ...rest);
    };
    window.PIXI.Assets.__gdbrowserRemotePatched = true;
  }

  async function ensureRenderer() {
    if (!window.PIXI || typeof loadIconLayers !== "function" || typeof Icon !== "function") {
      throw new Error("GDBrowser icon scripts did not load");
    }

    if (!iconStuffPromise) {
      iconStuffPromise = nativeFetch(ICONS_API, { cache: "force-cache" })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`GDBrowser icons API responded with ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          iconStuff = data;
          return data;
        });
    }

    await iconStuffPromise;

    if (!iconRenderer) {
      iconCanvas = document.createElement("canvas");
      iconRenderer = new window.PIXI.Application({
        view: iconCanvas,
        width: 480,
        height: 480,
        backgroundAlpha: 0,
        antialias: true,
        resolution: 1,
      });
    }
  }

  async function upscaleIcon(dataUrl, scale = 2) {
    const image = new Image();
    image.src = dataUrl;
    await image.decode();

    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth * scale;
    canvas.height = image.naturalHeight * scale;
    const context = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/png");
  }

  async function renderIconNow(profile, form, field) {
    await ensureRenderer();
    const iconID = profile[field];

    return new Promise((resolve, reject) => {
      const timeout = window.setTimeout(() => {
        reject(new Error(`Timed out rendering ${form} ${iconID}`));
      }, 15000);

      try {
        const internalForm = parseIconForm(form);
        loadIconLayers(internalForm, iconID, () => {
          try {
            new Icon(
              {
                id: iconID,
                form: internalForm,
                col1: parseIconColor(profile.col1),
                col2: parseIconColor(profile.col2),
                colG: parseIconColor(profile.colG),
                glow: Boolean(profile.glow),
                app: iconRenderer,
              },
              async (icon) => {
                try {
                  const dataUrl = await icon.getDataURL();
                  const highResolutionUrl = await upscaleIcon(dataUrl);
                  window.clearTimeout(timeout);
                  resolve(highResolutionUrl);
                } catch (error) {
                  window.clearTimeout(timeout);
                  reject(error);
                }
              },
            );
          } catch (error) {
            window.clearTimeout(timeout);
            reject(error);
          }
        });
      } catch (error) {
        window.clearTimeout(timeout);
        reject(error);
      }
    });
  }

  function renderIcon(profile, form, field) {
    const cacheKey = [
      form,
      profile[field],
      profile.col1,
      profile.col2,
      profile.colG,
      Boolean(profile.glow),
    ].join(":");

    if (renderedIconCache.has(cacheKey)) return renderedIconCache.get(cacheKey);

    const task = renderQueue.then(() => renderIconNow(profile, form, field));
    renderQueue = task.catch(() => undefined);
    renderedIconCache.set(cacheKey, task);
    task.catch(() => {
      if (renderedIconCache.get(cacheKey) === task) {
        renderedIconCache.delete(cacheKey);
      }
    });
    return task;
  }

  window.GDIconRenderer = { renderIcon };
  window.dispatchEvent(new Event("gd-icon-renderer-ready"));
})();
