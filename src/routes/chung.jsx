import { Layout, Tabs } from 'antd';
import ColorTab from '../components/chung/ColorTab.jsx';
import SizeTab from '../components/chung/SizeTab.jsx';

const { Content } = Layout;
const { TabPane } = Tabs

const GeneralPage = () => {
    return (
        <Content style={{ margin: '1rem 1rem 0 1rem' }}>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360, background: 'white' }}>
                <Tabs defaultActiveKey='color'>
                    <TabPane tab='Màu sắc' key='color'>
                        <ColorTab />
                    </TabPane>
                    <TabPane tab='Size' key='size'>
                        <SizeTab />
                    </TabPane>
                </Tabs>
            </div>
        </Content>
    );
}

export default GeneralPage;