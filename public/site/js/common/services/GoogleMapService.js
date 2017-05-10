/**
 * Servicio para interactual con los mapas de google
 *
 * @author Nelson D. Padilla and David E. Morales
 * @since 17-dic-2016
 *
 */

(function () {
    "use strict";

    angular
        .module('AdsbApp')
        .service('GoogleMapService', GoogleMapService);

    GoogleMapService.$inject = [];

    function GoogleMapService() {

        var drawPath = function (path) {

            var collection = [];
            var coord1, coord2;
            for (var i = 1; i < path.length; i++) {
                if (path[i] != null && (path[i].msgtype == 3 ||  path[i].msgtype == 2)) {
                    coord1 = path[i];
                }
                if (path[i - 1] != null && (path[i - 1].msgtype == 3 || path[i - 1].msgtype == 2)) {
                    coord2 = path[i - 1];
                }
                var step = [coord2, coord1];
                var color = altitudeColor(path[i].altitude);
                var draw = drawStep(step, color, false);
                collection.push(draw);
            }

            var airplaneIcon = {
                icon: planeSymbol,
                offset: '100%'
            }
            collection[collection.length - 1].icons.push(airplaneIcon);

            return collection;
        }

        var drawStep = function (step, color, drawIcon) {
            return {
                path: step,
                stroke: {
                    color: color,
                    weight: 5
                },
                geodesic: true,
                visible: true,
                icons: []
            }
        }

        var planeSymbol = {
            path: 'M362.985,430.724l-10.248,51.234l62.332,57.969l-3.293,26.145 l-71.345-23.599l-2.001,13.069l-2.057-13.529l-71.278,22.928l-5.762-23.984l64.097-59.271l-8.913-51.359l0.858-114.43 l-21.945-11.338l-189.358,88.76l-1.18-32.262l213.344-180.08l0.875-107.436l7.973-32.005l7.642-12.054l7.377-3.958l9.238,3.65 l6.367,14.925l7.369,30.363v106.375l211.592,182.082l-1.496,32.247l-188.479-90.61l-21.616,10.087l-0.094,115.684',
            scale: 0.0633, 
            strokeOpacity: 1,
            color: 'black',
            strokeWeight: 0,
            fillColor: '#000',
            fillOpacity: 1
        }

        var drawMarkers = function (type, markers, time) {
            var collection = [];
            for (var i = 0; i < markers.length; i++) {
                if (markers.length > 1 && markers[i + 1] != null) {
                    var now = moment(markers[i + 1].gentime);
                    var end = moment(markers[i].gentime);
                    var duration = moment.duration(now.diff(end));
                    if (duration.asSeconds() >= time) {
                        collection.push(createMarker(i, type, markers[i]));
                    }
                } else {
                    collection.push(createMarker(i, type, markers[i]));
                }
            }
            return collection;
        }

        var createMarker = function (i, type, point) {
            var ret = {
                id: i,
                latitude: point.latitude,
                longitude: point.longitude,
                alert: point.alert,
                icon: iconType(type)
            };

            return ret;
        }

        var iconType = function (type) {

            if (type == "gndspd") {
                return 'content/images/speed.png';
            } else if (type == "vspd") {
                return 'content/images/caution.png';
            } else if (type == "emerg") {
                return 'content/images/flag.png';
            } else if (type == "sqwk") {
                return 'content/images/radiotower.png';
            }
        }

        var altitudeColor = function (altitude) {

            if (altitude >= 0 && altitude <= 499)
                return '#FF0000';
            else if (altitude >= 500 && altitude <= 999)
                return '#FF6600';
            else if (altitude >= 1000 && altitude <= 1999)
                return '#CC9900';
            else if (altitude >= 2000 && altitude <= 2999)
                return '#FFCC00';
            else if (altitude >= 3000 && altitude <= 4999)
                return '#00CC00';
            else if (altitude >= 5000 && altitude <= 7499)
                return '#0033FF';
            else if (altitude >= 7500 && altitude <= 10000)
                return '#9900CC';
            else
                return '#000';
        }

        var fitMap = function (map, polylines) {
            var bounds = new google.maps.LatLngBounds();
            var firtsStep = new google.maps.LatLng(findFirstPoint(polylines).latitude,
                findFirstPoint(polylines).longitude);
            var lastStep = new google.maps.LatLng(findLastPoint(polylines).latitude,
                findLastPoint(polylines).longitude);

            bounds.extend(firtsStep);
            bounds.extend(lastStep);
            map.setCenter(bounds.getCenter());
            map.fitBounds(bounds);
        }

        var findFirstPoint = function (polylines) {
            for (var i = 0; i < polylines.length; i++) {
                var path = polylines[i].path[0];
                if (path.latitude != undefined && path.longitude) {
                    return {
                        latitude: path.latitude,
                        longitude: path.longitude
                    }
                }
            }
        }

        var findLastPoint = function (polylines) {
            for (var i = polylines.length - 1; i > 0; i--) {
                var path = polylines[i].path[0];
                if (path.latitude != undefined && path.longitude) {
                    return {
                        latitude: path.latitude,
                        longitude: path.longitude
                    }
                }
            }
        }

        return {
            drawPath: drawPath,
            drawMarkers: drawMarkers,
            fitMap: fitMap
        }
    }
} ());
