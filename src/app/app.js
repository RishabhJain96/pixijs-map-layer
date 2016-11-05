import { PixiLayer } from '../../lib';

$(document).ready(function() {
    var mapOptions = {
        center: { lat: 34.0522, lng: -118.2437},
        zoom: 5
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    function initialize() {
        var myLayer;
        myLayer = new PixiLayer(map, {
            transparent: true,
        });
        myLayer.addLayer((layer, mapProjection) => {
            let point = { lat: 34.0522, lng: -118.2437 };
            let convertedPoint = mapProjection.fromLatLngToPoint(new google.maps.LatLng(point));

            var graphics = new PIXI.Graphics();
            graphics.beginFill(0xFF0000);
            graphics.lineStyle(1, 0xFFFF00);
            graphics.drawRect(convertedPoint.x, convertedPoint.y, 3, 3);
            layer.addChild(graphics);
        });
    }
    google.maps.event.addDomListener(window, 'load', initialize);
});