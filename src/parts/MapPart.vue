<template>
    <div class="map-wrapper" >
        <div class="scale-text">
            <div class="scale-text-label">{{ scaleText }}</div>
        </div>
        <div :id="mapId" class="esri-map" />
    </div>
</template>

<script>
import Vue from "vue";
import mapUtils from "@/utils/mapUtils";


export default Vue.extend({
    name: "map-part",
    props: ["ready", "mapId", "searchNode", "searchPlaceholder"],
    data: function() {
        return {
            esriMap: null,
            scaleText: ""
        };
    },
    components: {},
    created() {
        // use ready instead, as we're dependent on esri modules

    },
    methods: {
        init() {
            var vueContext = this;
            var em = mapUtils.getEsriModules();
            
            mapUtils.loadEsriMap(this.mapId, this.searchNode, this.searchPlaceholder).then((viewAndWidgets) => {
                var view = viewAndWidgets[0];
                var searchWidget = viewAndWidgets[1];

                this.esriMap = view;
                var watchUtils = em.watchUtils;
                
                // watch for map movement
                watchUtils.whenTrue(view, "stationary", () => {
                    // init sync after change
                    this.$store.commit('sync', [view.zoom, this.mapId]);
                });

                view.watch("scale", () => {
                    const roundedScale = view.scale.toFixed();
                    vueContext.scaleText = `1:${roundedScale}`;
                });

                searchWidget.on("select-result", () => {
                    
                });
                
            }, (err) => {
                console.error(err);
            });

        },
        async setScale(scaleLevel) {
            if (this.esriMap != null && scaleLevel != null) {
                var diff = this.esriMap.zoom - scaleLevel;
                if (diff > -0.1 && diff < 0.1) {
                    // a guess that the map has already synched, scale level is the same
                    return;
                }
                console.warn("Comparea: " + this.mapId + ": setting zoom to " + scaleLevel);
                await this.esriMap.goTo({
                    zoom: scaleLevel
                });
                console.warn("Comparea: " + this.mapId + ": scale set")
                this.$store.commit("syncing", false);
            }
        },
        
    },
    watch: {
        "ready"() {
            this.init();
        },
        async "$store.state.syncProps"() {
            if (this.$store.state && this.$store.state.syncProps) {
                // if sent from the other map, sync up
                var scaleLevel = this.$store.state.syncProps[0];
                var senderId = this.$store.state.syncProps[1];
                if (senderId !== this.mapId && this.esriMap !== null) {
                    await this.setScale(scaleLevel);
                }
            }
        }

    }

});
</script>


<style lang="scss" >

.scale-text {
    z-index: 1000;
    position: absolute;
    bottom: 25px;
    left: 10px;
    font-weight: bold;
    color: #6e6e6e;
    background-color: #fff;
    padding-left: 4px;
    padding-right: 4px;
}

.map-wrapper {
    // wrapper does not like absolute for some reason
    position: relative;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;

}

.esri-map {
    width: 100%;
    height: 100%;
    
}

.map-icon {
    position: absolute;
    z-index: 1000;
    padding-top: 6px;
    padding-left: 4px;
    padding-right: 4px;
    border-radius: 4px;
    cursor: pointer;

}


</style>

