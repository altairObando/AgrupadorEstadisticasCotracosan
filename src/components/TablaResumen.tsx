import { Table } from 'antd';
import React, { useContext } from 'react';
import { MyAppContext } from '../data/AppContext';
import { DataRow } from '../interfaces/DataRow';
import { Tramo } from '../interfaces/Tramo';

interface TablaTramosProps {
    tramos: Tramo[];
}



const TablaTramos:React.FC<TablaTramosProps> = ({ tramos }) => {
    console.log('tramos', tramos);
    return <Table dataSource={ (tramos || []).filter(( value, index, arr) => arr.findIndex(item => item.nombre == value.nombre) === index ) } rowKey={ record => record.nombre } >
        <Table.Column title='Nombre'   dataIndex='nombre' key='nombre' />
        <Table.Column title='Paradas'  dataIndex='ubicaciones' key='ubicaciones' render={  val => val.length } />
        <Table.Column title='Subieron' dataIndex='totalSuben' key='totalSuben' />
        <Table.Column title='Bajaron'  dataIndex='totalBajan' key='totalBajan' />
        <Table.Column title='Tiempo'   dataIndex='ubicaciones'key='tiempo' render={ (ubicaciones: DataRow[]) => {
            if(ubicaciones.length == 0) return 0;
            const tiempo = new Date(ubicaciones[ubicaciones.length - 1].fechaHora).getTime() - new Date(ubicaciones[0].fechaHora).getTime();
            if(tiempo > 0) return Math.floor(tiempo / 60000) ;
            return ''
        }} />
        <Table.Column title='Precio'  dataIndex='precio' key='precio' />
        <Table.Column title='Total'    dataIndex='precio' key='total' render={ (_, record: Tramo ) => Number( record.totalBajan * record.precio ).toLocaleString('es-NI', { maximumFractionDigits: 2, currency: 'NIO' }) } />
    </Table>
}

export const TablaResumen : React.FC =()=>{
    const { data } = useContext(MyAppContext);
    console.log('Buses',data)
    return <Table 
        dataSource={ data }
        rowKey={ record => record.placa }
        expandable={ { 
            expandedRowRender: (record) => <TablaTramos tramos={ record?.tramos?? [] } /> } } >
        <Table.Column title='Placa' dataIndex='placa' key='placa' />

    </Table>
}