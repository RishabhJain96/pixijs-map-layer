function PixiLayer(map, interactive) {
    this.map = map;
    this.resolutionScale = window.devicePixelRatio || 1;
    this.interactive = interactive || false;

    this.canvasLayer = new CanvasLayer({
        map: map,
        animate: false,
        resolutionScale: this.resolutionScale,
        paneName: 'overlayMouseTarget',
    });

    this.renderer = PIXI.autoDetectRenderer(this.canvasLayer.canvas.width, this.canvasLayer.canvas.height, {
        view: this.canvasLayer.canvas,
        transparent: true,
        forceFXAA: true,
        antiAlias: true,
    });

    this.stage = new PIXI.Container();
    this.stage.interactive = this.interactive;

    function updateHandler() {
        var mapProjection = this.map.getProjection();
        var scale = Math.pow(2, this.map.zoom) * pixiLayer.resolutionScale;
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

    var pixiLayer = this;
    updateHandler.bind(pixiLayer);
    resizeHandler.bind(pixiLayer);

    this.addLayer.bind(this);
    this.getContainer.bind(this);
    this.getRenderer.bind(this);
    this.clear.bind(this);

    this.canvasLayer.setUpdateHandler(updateHandler);
    this.canvasLayer.setResizeHandler(resizeHandler);
}

PixiLayer.prototype.addLayer = function(drawFunction) {
    var layer = new PIXI.Container();
    layer.interactive = this.interactive;
    var mapProjection = this.map.getProjection();
    drawFunction(layer, mapProjection);
    this.stage.addChild(layer);
    this.renderer.render(this.stage);
}

PixiLayer.prototype.getContainer = function() {
    return this.stage;
}

PixiLayer.prototype.getRenderer = function() {
    return this.renderer;
}

PixiLayer.prototype.clear = function() {
    for (var i = this.stage.children.length - 1; i >= 0; i--) {
        this.stage.removeChild(this.stage.children[i]);
    }
}

module.exports = PixiLayer;
