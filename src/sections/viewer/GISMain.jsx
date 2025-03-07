import React from 'react'
import GISToolbar from './GISToolbar'
import GISMenuBar from './GISMenuBar'
import GISViewer from './GISViewer'
import { useRef,useState } from 'react'
import { TILE_LAYERS } from '../map_tile_providerGISViewer'
import GISSpliceGUI from './GISSpliceGUI'
const GISMain = () => {
    const [currentTileLayer, setCurrentTileLayer] = useState(
      TILE_LAYERS.OpenStreetMapUK
    );
      const [modalJointInfo, setModalJointInfo] = useState("");
    
  
  return (
    <div>
          <GISMenuBar />
          <GISToolbar onTileLayerChange={setCurrentTileLayer} />
          <GISViewer tileLayer={currentTileLayer}/>
          <GISSpliceGUI modalContentInfo={setModalJointInfo} />
    </div>

  )
}

export default GISMain