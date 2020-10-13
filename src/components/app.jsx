import { Component } from 'preact';
import { Router, route } from 'preact-router';
import { Layout, Menu, Button } from 'antd';
import { PieChartOutlined, DesktopOutlined } from '@ant-design/icons';
import lscache from 'lscache';

// Code-splitting is automated for `routes` directory
import Home from '../routes/home/index.js';
import Profile from '../routes/profile/index.js';
import GeneralPage from '../routes/chung.jsx';
import HanghoaPage from '../routes/hanghoa.jsx';

const { Header, Sider } = Layout;
const { SubMenu } = Menu;

class App extends Component {
	state = {
		collapsed: lscache.get('collapsed') || false,
		selectedKey: typeof window !== 'undefined' ? window.location.pathname : '',
		openKey: lscache.get('openKey') || ''
	}

	onMenuClick = ({ key, keyPath }) => {
		lscache.set('openKey', keyPath[1]);
		this.setState({ openKey: keyPath[1], selectedKey: key });
		route(key);
	}

	onSubmenuClick = ({ key }) => {
		lscache.set('openKey', key);
		this.setState(prevState => {
			if (prevState.openKey === key)
				return { openKey: '' };
			else
				return { openKey: key };
		});
	}

	render() {

		return (
			<Layout className="site-layout">
				<Sider onCollapse={this.onCollapse} style={{ height: '100vh' }}>
					<div className="logo" />
					<Menu theme="dark" selectedKeys={[this.state.selectedKey]} openKeys={[this.state.openKey]} mode='inline' onClick={this.onMenuClick}>
						<Menu.Item key='/' icon={<PieChartOutlined />}>
							Trang chủ
							</Menu.Item>
						<Menu.Item key='/dashboard' icon={<DesktopOutlined />}>
							Tổng hợp
							</Menu.Item>
						<SubMenu key='danhmuc' title='Quản lý danh mục' onTitleClick={this.onSubmenuClick}>
							<Menu.Item key='/danhmuc/chung' icon={<DesktopOutlined />}>
								Thông tin chung
								</Menu.Item>
							<Menu.Item key='/danhmuc/hanghoa' icon={<DesktopOutlined />}>
								Loại hàng
                            </Menu.Item>
						</SubMenu>
					</Menu>
				</Sider>
				<Layout style={{ height: '100vh' }}>
					<Header style={{ padding: 0, background: 'white' }}>
						<Button type='primary' size='large' style={{ marginLeft: '2rem' }}>
							Bán hàng
                        </Button>
					</Header>
					<Layout style={{ overflowY: 'scroll', overflowX: 'auto' }}>
						<Router>
							<Home path="/" />
							<GeneralPage path='/danhmuc/chung' />
							<HanghoaPage path='/danhmuc/hanghoa' />
						</Router>
					</Layout>
				</Layout>
			</Layout>
		)
	}
}


export default App;
