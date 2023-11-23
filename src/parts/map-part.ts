import Map from "@arcgis/core/Map.js";
import Search from "@arcgis/core/widgets/Search";
import ScaleBar from "@arcgis/core/widgets/ScaleBar";
import BasemapToggle from "@arcgis/core/widgets/BasemapToggle";
import MapView from "@arcgis/core/views/MapView";
import SceneView from "@arcgis/core/views/SceneView";


export interface MapPart {
    view: SceneView,
}


export function setupMap(element: HTMLDivElement, searchDomNode: HTMLDivElement, searchPlaceholder: string): MapPart {

    var map = new Map({
        basemap: "arcgis-imagery",
        // A ground preset containing a single elevation layer, sourced from
        // https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer
        ground: "world-elevation"
    });
    // place map in container
    var view = new SceneView({
        map: map,
        container: element!
    });

    // add map widgets
    var toggle = new BasemapToggle({
        view: view,
        nextBasemap: "arcgis-navigation"
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

function setupSearch(view: SceneView, searchDomNode: HTMLDivElement, searchPlaceholder: string) {

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
    });
    
}
