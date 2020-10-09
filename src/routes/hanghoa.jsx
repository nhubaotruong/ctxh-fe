import { Layout } from 'antd';
import Hanghoa from '../components/hanghoa/Hanghoa.jsx';

const { Content } = Layout;

const HanghoaPage = () => {
    return (
        <Content style={{ margin: '1rem 1rem 0 1rem' }}>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360, background: 'white' }}>
                <Hanghoa />
            </div>
        </Content>
    );
}

export default HanghoaPage;