// esri map init functions
/* eslint-disable */
import * as esriLoader from "esri-loader";


function getGpsGraphicJson() {
    return {
        "geometry": {
            "x": 0.0,
            "y": 0.0
        },
        "attributes": {},
        "symbol": {
            "color": [
                30,
                100,
                255,
                255
            ],
            "size": 10,
            "angle": 0,
            "xoffset": 0,
            "yoffset": 0,
            "type": "esriSMS",
            "style": "esriSMSCircle",
            "outline": {
                "color": [
                    255,
                    255,
                    255,
                    255
                ],
                "width": 1,
                "type": "esriSLS",
                "style": "esriSLSSolid"
            }
        }
    };

}

var loadEsriModules = (apiOptions) => {
    // load arcgis/esri modules using esri-loader, save to global property for further use

    var promise = new Promise((resolve, reject) => {
        // include all required modules here for performance, even if not using them now 
        // modules are saved in memory and this function is called early in lifecycle 
        esriLoader.loadModules(['esri/views/MapView',
            "esri/views/SceneView",
            "esri/Map",
            'esri/WebMap',
            "esri/core/watchUtils",
            "esri/widgets/ScaleBar",
            "esri/widgets/Search",
            "esri/tasks/Locator",
            "esri/widgets/BasemapToggle"

        ], apiOptions).then(([MapView,
            SceneView,
            Map,
            WebMap,
            watchUtils,
            ScaleBar,
            Search,
            Locator,
            BasemapToggle
        ]) => {
            // make a global var
            window.esriModules = {
                // add all modules here as needed 
                watchUtils: watchUtils
            };
            resolve();

        }, (err) => {
            reject(err);

        });
    });
    return promise;

}

function getEsriModules() {
    // return global var
    return window.esriModules;

}

function loadEsriMap(domNode, searchDomNode, searchPlaceholder) {
    // load esri map, including related search widget

    // return promise when map loads
    var promise = new Promise((resolve, reject) => {

        // load esri API
        // first, we use Dojo's loader to require the map class
        esriLoader.loadModules([
                "esri/views/SceneView",
                "esri/Map",
                'esri/WebMap',
                "esri/core/watchUtils",
                "esri/widgets/ScaleBar",
                "esri/widgets/Search",
                "esri/tasks/Locator",
                "esri/widgets/BasemapToggle"
            ])
            .then(([
                SceneView,
                Map,
                WebMap,
                watchUtils,
                ScaleBar,
                Search,
                Locator,
                BasemapToggle
            ]) => {

                var map = new Map({
                    basemap: "streets",
                    // A ground preset containing a single elevation layer, sourced from
                    // https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer
                    ground: "world-elevation"
                })
                // show map in a container w/ id 
                var view = new SceneView({
                    map: map,
                    container: domNode
                });

                // if search widget requested
                if (searchDomNode) {
                    var sources = [{
                        locator: new Locator({
                            url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
                        }),
                        singleLineFieldName: "SingleLine",
                        outFields: ["Addr_type"],
                        name: "ArcGIS World Geocoding Service",
                        localSearchOptions: {
                            minScale: 300000,
                            distance: 50000
                        },
                        placeholder: searchPlaceholder
                    }];

                    var searchWidget = new Search({
                        id: searchDomNode + "-searchWidget",
                        view: view,
                        includeDefaultSources: false,
                        sources: sources
                    }, searchDomNode);
                }

                // add map widgets
                var toggle = new BasemapToggle({
                    view: view,
                    nextBasemap: "hybrid"
                });
                view.ui.add(toggle, "top-right");

                // return view
                resolve([view, searchWidget]);

            }).catch(err => {
                // handle any errors
                console.error(err);
                reject(err);

            });
    });

    return promise;

}


function goCurrentLocation() {

    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(function (position) {
            resolve();

        }, function (error) {
            reject(error);
            // "Unable to get location. Enable location on your device."

        }, {
            maximumAge: 60000,
            timeout: 5000,
            enableHighAccuracy: false
        });

    });

}


export default {
    loadEsriModules,
    getEsriModules,
    loadEsriMap,

}