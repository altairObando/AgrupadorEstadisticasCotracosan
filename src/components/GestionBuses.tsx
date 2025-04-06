import React, { useContext, useState } from 'react';
import { ListaBuses } from './ListaBuses';
import { Agrupador } from './Agrupador';
import { DataGroup } from '../interfaces/DataGroup';
import { MyAppContext } from '../data/AppContext';


export const GestionBuses: React.FC = () => {
  const { setBusSeleccionado } = useContext( MyAppContext )
  const [modalVisible, setModalVisible] = useState(false);

  const handleAgrupar = (bus: DataGroup) => {
    setBusSeleccionado(bus);
    setModalVisible(true);
  }

  return (
    <>
      <div style={{ display: modalVisible ? 'none': 'block', width: '100%' }}>
        <ListaBuses onAgrupar={handleAgrupar} />
      </div>
      <div style={{ display: !modalVisible ? 'none': 'block', width: '100%' }}>
        <Agrupador onClose={ ()=> { setModalVisible(false) }} />
      </div>
    </>
  );
};