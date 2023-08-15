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
        esriLoader.loadModules([
            "esri/config",
            'esri/views/MapView',
            "esri/views/SceneView",
            "esri/Map",
            'esri/WebMap',
            "esri/core/watchUtils",
            "esri/widgets/ScaleBar",
            "esri/widgets/Search",
            "esri/widgets/BasemapToggle",
            "esri/rest/locator",
            "esri/Graphic"

        ], apiOptions).then(([
            esriConfig,
            MapView,
            SceneView,
            Map,
            WebMap,
            watchUtils,
            ScaleBar,
            Search,
            BasemapToggle,
            Locator,
            Graphic
        ]) => {
            // make a global var
            window.esriModules = {
                // add all modules here as needed 
                watchUtils: watchUtils
            };
            // add API key
            
            // d.aa account:
            // esriConfig.apiKey = "AAPKb2a0569ce4ce46ef8d1a4cb2db649c7fr468CGP2QCgVv-oWt5Qf45nTqaidqaIWxZGjZZOwBG_KfBePJanwBO3xLu-z6S5x";
            
            // aalbe. account:
            esriConfig.apiKey = "AAPK7abf79bc68e64178a8985de96cc5de57zo6W6VXuTSt3MlhsegSd_SJI5RXQnp7RkUV5Nazw3-vY4zV6SS1oZ4FeeWIjgWpy";

            /*
            esriConfig.request.interceptors.push({
                before: function (params) {
                    // referer not being sent on deployed app. Testing.
                    params.requestOptions.header = {
                        referer: location.href
                    }
                },
            }); */

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
            "esri/config",
            "esri/views/SceneView",
            "esri/Map",
            'esri/WebMap',
            "esri/core/watchUtils",
            "esri/widgets/ScaleBar",
            "esri/widgets/Search",
            "esri/widgets/BasemapToggle",
            "esri/rest/locator",
            "esri/Graphic"
        ])
            .then(([
                esriConfig,
                SceneView,
                Map,
                WebMap,
                watchUtils,
                ScaleBar,
                Search,
                BasemapToggle,
                Locator,
                Graphic
            ]) => {

                // add API key
                esriConfig.apiKey = "AAPK7abf79bc68e64178a8985de96cc5de57zo6W6VXuTSt3MlhsegSd_SJI5RXQnp7RkUV5Nazw3-vY4zV6SS1oZ4FeeWIjgWpy";

                var map = new Map({
                    basemap: "arcgis-imagery",
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
                        url: "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer",
                        singleLineFieldName: "SingleLine",
                        outFields: ["Addr_type"],
                        name: "ArcGIS World Geocoding Service",
                        // localSearchOptions: {
                        //     minScale: 300000,
                        //     distance: 50000
                        // },
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
                    nextBasemap: "arcgis-navigation"
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
