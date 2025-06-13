import { Layout, Menu } from "antd";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { DashboardOutlined, MenuOutlined } from "@ant-design/icons";

const { Sider, Header, Content } = Layout;

const AdminLayout = ({ children }) => {
  const menuItems = [
    {
      key: "1",
      icon: <DashboardOutlined />,
      label: <Link to="/admin">Dashboard</Link>,
    },
    {
      key: "26",
      icon: <DashboardOutlined />,
      label: <Link to="/admin/users">User List</Link>,
    },
    {
      key: "2",
      icon: <MenuOutlined />,
      label: <Link to="/admin/article">Article</Link>,
      children: [
        {
          key: "3",

          label: <Link to="/admin/article/create"> Add Article</Link>,
        },
        {
          key: "4",

          label: <Link to="/admin/article/update">Update Article</Link>, 
        },
      ],
    },
    {
      key: "5",
      icon: <MenuOutlined />,
      label: <Link to="/admin/benchmarks">Benchmarks</Link>,
      children: [
        {
          key: "6",

          label: <Link to="/admin/benchmarks/create"> Add new Benchmark</Link>,
        },
        {
          key: "7",

          label: <Link to="/admin/benchmarks/update">Benchmarks</Link>,
        },
      ],
    },
    {
      key: "11",
      icon: <MenuOutlined />,

      label: <Link to="/admin/dissertations">Thesis</Link>,
      children: [
        {
          key: "12",

          label: <Link to="/admin/dissertation/create"> Add new Thesis</Link>,
        },
        {
          key: "13",

          label: <Link to="/admin/dissertation/update">Update Thesis</Link>,
        },
      ],
    },
    {
      key: "14",
      icon: <MenuOutlined />,

      label: <Link to="/admin/course">Courses</Link>,
      children: [
        {
          key: "15",

          label: <Link to="/admin/course/create">Add new Course</Link>,
        },
        {
          key: "16",
          label: <Link to="/admin/course/update">Update Course</Link>,
        },
      ],
    },
    {
      key: "17",
      icon: <MenuOutlined />,

      label: <Link to="/admin/tool">Tools</Link>,
      children: [
        {
          key: "18",

          label: <Link to="/admin/tool/create"> Add new Tool</Link>,
        },
        {
          key: "19",

          label: <Link to="/admin/tool/update">Update Tool</Link>,
        },
      ],
    },
    {
      key: "20",
      icon: <MenuOutlined />,

      label: <Link to="/admin/datasets">Datasets</Link>,
      children: [
        {
          key: "21",
          label: <Link to="/admin/dataset/create">Add new Dataset</Link>,
        },
        {
          key: "22",
          label: <Link to="/admin/dataset/update">Update Dataset</Link>,
        },
      ],
    },
    {
      key: "23",
      icon: <MenuOutlined />,
      label: <Link to="/admin/llm">Llm Models</Link>,
      children: [
        {
          key: "24",
          label: <Link to="/admin/llm/create">Create new Llm</Link>,
        },
        {
          key: "25",
          label: <Link to="/admin/llm/update">Update Llm</Link>,
        },
      ],
    },
  ];

  return (
    <div className="admin-layout">
      {" "}
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        <Sider width={200} theme="dark">
          <Menu
            mode="vertical"
            style={{
              height: "100%",
            }}
            items={menuItems}
          />
        </Sider>
        <Layout>
          <Header>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "white",
                width: "100%",
              }}
            >
              <h2>Admin Panel</h2>
            </div>
          </Header>
          <Content>
            <div
              className="site-layout-background"
              style={{
                padding: "24px 50px",
                minHeight: 360,
                width: "100%",
              }}
            >
              {children}
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default AdminLayout;
AdminLayout.propTypes = {
  children: PropTypes.node,
};
