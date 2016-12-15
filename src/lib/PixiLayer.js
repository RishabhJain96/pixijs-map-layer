import { default as CanvasLayer } from 'canvaslayer';
let PIXI = require('pixi.js');

export default class PixiLayer {
    constructor(map, options = {}) {
        this.map = map;

        this.options = {
            animate: false,
            resolutionScale: (window.devicePixelRatio || 1),
            interactive: true,
            paneName: 'overlayMouseTarget',
            transparent: true,
            forceFXAA: true,
            antiAlias: true,
            resolution: (window.devicePixelRatio || 1),
            ...options,
        }

        function updateHandler() {
            var mapProjection = this.map.getProjection();
            var scale = Math.pow(2, this.map.zoom) * pixiLayer.options.resolutionScale;
            var offset = mapProjection.fromLatLngToPoint(this.getTopLeft());

            pixiLayer.stage.position.x = -offset.x * scale;
            pixiLayer.stage.position.y = -offset.y * scale;

            pixiLayer.stage.scale.x = scale;
            pixiLayer.stage.scale.y = scale;

            pixiLayer.renderer.render(pixiLayer.stage);
        }

        function resizeHandler() {
            pixiLayer.renderer.resize(this.canvas.width, this.canvas.height);
        }


        const pixiLayer = this;
        updateHandler.bind(pixiLayer);
        resizeHandler.bind(pixiLayer);

        this.canvasLayer = new CanvasLayer({
            map: map,
            animate: this.options.animate,
            resolutionScale: this.options.resolutionScale,
            paneName: this.options.paneName,
            resizeHandler: resizeHandler,
            updateHandler: updateHandler,
        });

        this.renderer = PIXI.autoDetectRenderer(this.canvasLayer.canvas.width, this.canvasLayer.canvas.height, {
            view: this.canvasLayer.canvas,
            ...options,
        });

        this.stage = new PIXI.Container();
        this.stage.interactive = this.options.interactive;

        this.prevHeight;
        this.prevWidth;
        this.ratio;

        this.renderer.render(this.stage);
    }

    addLayer = (drawFunction) => {
        var layer = new PIXI.Container();
        layer.interactive = this.options.interactive || false;
        let mapProjection = this.map.getProjection();
        drawFunction(layer, mapProjection);
        this.stage.addChild(layer);
        this.renderer.render(this.stage);
    }

    getContainer = () => {
        return this.stage;
    }

    getRenderer = () => {
        return this.renderer;
    }

    clear = () => {
        for (let i = this.stage.children.length - 1; i >= 0; i--) {
            this.stage.removeChild(this.stage.children[i]);
        }
    }

    setMap = (map) => {
        this.map = map;
    }

    rerender = () => {
        this.renderer.render(this.stage);
    }
}