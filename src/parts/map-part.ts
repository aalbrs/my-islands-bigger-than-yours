import Map from "@arcgis/core/Map.js";
import Search from "@arcgis/core/widgets/Search";
import BasemapToggle from "@arcgis/core/widgets/BasemapToggle";
import MapView from "@arcgis/core/views/MapView";
// import ScaleBar from "@arcgis/core/widgets/ScaleBar";


export interface MapPart {
    view: MapView,
}


export function setupMap(element: HTMLDivElement, searchDomNode: HTMLDivElement, searchPlaceholder: string): MapPart {

    var map = new Map({
        basemap: "arcgis-topographic", // also "topo-vector"
        
        // For SceneView, a ground preset containing a single elevation layer, sourced from
        // https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer
        // ground: "world-elevation"
    });
    // place map in container
    var view = new MapView({
        map: map,
        container: element!
    });

    // add map widgets
    var toggle = new BasemapToggle({
        view: view,
        nextBasemap: "arcgis-imagery"
    });
    view.ui.add(toggle, "top-right");

    // if search widget requested
    if (searchDomNode) {
        setupSearch(view, searchDomNode, searchPlaceholder)
    }

    return {
        view
    }
}

function setupSearch(view: MapView, searchDomNode: HTMLDivElement, searchPlaceholder: string): Search {

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
        container: searchDomNode,
        view: view,
        includeDefaultSources: false,
        sources: sources,
        popupEnabled: false
    });
    return searchWidget;
}
