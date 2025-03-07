export default{
maptiler:{

    url:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}

}

export const TILE_LAYERS = {

      CartoDBPositron: {
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        header: '© CartoDB Positron Dark',
        attribution: '© CartoDB, <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      },
      CartoDBDark: {
        url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
        header: "© CartoDB Dark",
        attribution:
          "© CartoDB, <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
        maxZoom: 19,
      },
    OpenStreetMap:{

        url:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        header:' © OpenStreetMap',
        attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
    GoogleSatellite: {
        url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
        header: '© Google Satellite',
        attribution: '© Google Satellite',
        maxZoom: 25
    },
    GoogleHybrid: {
        url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
        header: '© Google Satellite Hybrid',
        attribution: '© Google Satellite Hybrid',
        maxZoom: 25
    },
    GoogleTerrainHybrid: {
        url: 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
        header: '© Google Terrain Hybrid',
        attribution: '© Google Terrain Hybrid',
        maxZoom: 25
    },
    EsriImagery: {
        url: 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        header: '© Esri Imagery',
        attribution: '© Esri Imagery',
        maxZoom: 25
    },
    CartoLight: {
        url: 'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        header: '© Carto Light',
        attribution: '© Carto Light',
        maxZoom: 25
    },
    OpenStreetMapUK: {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        header: '© OpenStreetMap',
        attribution: '© OpenStreetMap',
        maxZoom: 25,
    },
    CartoDBPositron: {
        url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        header: '© CartoDB Positron',
        attribution: '© CartoDB Positron',
        maxZoom: 25
    },
    OpenStreetMapUS: {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        header: '© OpenStreetMap',
        attribution: '© OpenStreetMap',
        maxZoom: 25
    },
    EsriWorldStreetMap: {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
        header: '© Esri World Street Map',
        attribution: '© Esri World Street Map',
        maxZoom: 25
    },
    // UsgsTopoMaps: {
    //     url: 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}',
    //     header: '© USGS Topo Maps',
    //     attribution: '© USGS Topo Maps',
    //     maxZoom: 19
    // },
    // nasaBlueMarble: {
    //     url: 'https://map1.vis.earthdata.nasa.gov/wmts-webmerc/BlueMarble_NextGeneration/default/{z}/{y}/{x}.jpg',
    //     header: '© NASA Blue Marble',
    //     attribution: '© NASA Blue Marble',
    //     maxZoom: 19
    // }
};