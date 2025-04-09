import { Card, Layout, StepProps, Steps, Flex, Space, Avatar } from 'antd';
import { FileAddOutlined, ControlOutlined, CalculatorOutlined, ApiOutlined } from '@ant-design/icons';
import { useContext, useState } from 'react';
import { CargaArchivo } from './components/CargaArchivo';
import { DataGroup } from './interfaces/DataGroup';
import { GestionBuses } from './components/GestionBuses';
import { MyAppContext } from './data/AppContext';
import { TablaResumen } from './components/TablaResumen';

const { Footer, Content } = Layout;

const Pasos: StepProps[] = [ 
  { title:'Carga', description: 'Carga de Archivo', icon: <FileAddOutlined /> },
  { title:'Configurar', description: 'Agrupa por tramo y establecer el precio', icon: <ControlOutlined /> },
  { title:'Resumen', description: 'Resumen', icon: <CalculatorOutlined />},
  //{ title:'Resultado', description: 'Total Calculado', icon: <DollarOutlined /> },
];

function App() {
  const [ current, setCurrent ] = useState(0);
  const { setData } = useContext(MyAppContext)
  const manejarDatosActualizados = (nuevosDatos: DataGroup[]) => {
    setData(nuevosDatos);
    setCurrent(1);
  };

  return (
    <Layout style={{ flex: 1, display: 'flex', padding: '1em'}}>
      <Space>
            <Avatar size={'large'} icon={<ApiOutlined />} />
            <h2>Agrupador de estadisticas</h2>      
          </Space>
      <Content style={{ flex: 1, minHeight: '50em'}}>
        <Flex gap='middle' vertical>
          <Card>
            <Steps 
              current={current}
              items={Pasos}
              type='navigation'
              onChange={value => setCurrent(value)}
            />
          </Card>
          <Card>
            <div style={{ display: current== 0 ?'block': 'none' }}>
                <CargaArchivo onDatosActualizados={manejarDatosActualizados} />
            </div>
            <div style={{ display: current== 1 ?'block': 'none' }}>
                <GestionBuses onNext={ ()=> setCurrent(current +1 ) } onPrevious={ ()=> setCurrent(current - 1) }/>
            </div>
            <div style={{ display: current== 2?'block': 'none' }}>
                <TablaResumen />
            </div>
            <div style={{ display: current== 3?'block': 'none' }}>
                Total Calculado
            </div>
          </Card>
        </Flex>
      </Content>
      <Footer>Cotracosan {new Date().getFullYear()}</Footer>
    </Layout>
  );
}

export default App;
