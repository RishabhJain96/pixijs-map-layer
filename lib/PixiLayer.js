'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _canvaslayer = require('canvaslayer');

var _canvaslayer2 = _interopRequireDefault(_canvaslayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PIXI = require('pixi.js');

var PixiLayer = function PixiLayer(map) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, PixiLayer);

    _initialiseProps.call(this);

    this.map = map;

    this.options = _extends({
        animate: false,
        resolutionScale: window.devicePixelRatio || 1,
        interactive: true,
        paneName: 'overlayMouseTarget',
        transparent: true,
        forceFXAA: true,
        antiAlias: true,
        resolution: window.devicePixelRatio || 1
    }, options);

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

    var pixiLayer = this;
    updateHandler.bind(pixiLayer);
    resizeHandler.bind(pixiLayer);

    this.canvasLayer = new _canvaslayer2.default({
        map: map,
        animate: this.options.animate,
        resolutionScale: this.options.resolutionScale,
        paneName: this.options.paneName,
        resizeHandler: resizeHandler,
        updateHandler: updateHandler
    });

    this.renderer = PIXI.autoDetectRenderer(this.canvasLayer.canvas.width, this.canvasLayer.canvas.height, _extends({
        view: this.canvasLayer.canvas
    }, options));

    this.stage = new PIXI.Container();
    this.stage.interactive = this.options.interactive;

    this.prevHeight;
    this.prevWidth;
    this.ratio;

    this.renderer.render(this.stage);
};

var _initialiseProps = function _initialiseProps() {
    var _this = this;

    this.addLayer = function (drawFunction) {
        var layer = new PIXI.Container();
        layer.interactive = _this.options.interactive || false;
        var mapProjection = _this.map.getProjection();
        drawFunction(layer, mapProjection);
        _this.stage.addChild(layer);
        _this.renderer.render(_this.stage);
    };

    this.getContainer = function () {
        return _this.stage;
    };

    this.getRenderer = function () {
        return _this.renderer;
    };

    this.clear = function () {
        for (var i = _this.stage.children.length - 1; i >= 0; i--) {
            _this.stage.removeChild(_this.stage.children[i]);
        }
    };

    this.setMap = function (map) {
        _this.map = map;
    };

    this.rerender = function () {
        _this.renderer.render(_this.stage);
    };
};

exports.default = PixiLayer;