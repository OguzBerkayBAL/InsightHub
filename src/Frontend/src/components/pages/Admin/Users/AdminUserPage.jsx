import { Table, message, Popconfirm, Button, Space } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminUserPage = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const apiUrl = "http://localhost:3000/user";
  const navigate = useNavigate();
  // Tüm kullanıcıları getir
  const getAllUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDataSource(response.data.data); // Kullanıcıları tabloya yükle
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Kullanıcılar alınırken bir hata oluştu.");
    }
  };

  // Kullanıcı silme işlemi
  const deleteUser = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${apiUrl}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success("Kullanıcı başarıyla silindi.");
      getAllUsers(); // Kullanıcıları yeniden getir
    } catch (error) {
      console.error("Error deleting user:", error);
      message.error("Kullanıcı silinirken bir hata oluştu.");
    }
  };

  useEffect(() => {
    setLoading(true);
    getAllUsers();
    setLoading(false);
  }, []);

  const columns = [
    {
      title: "Username",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => navigate(`/admin/user/update/${record.id}`)}>Düzenle</Button>
          <Popconfirm
            title="Bu kullanıcıyı silmek istediğinizden emin misiniz?"
            onConfirm={() => deleteUser(record.id)} // Kullanıcıyı sil
            okText="Evet"
            cancelText="Hayır"
          >
            <Button type="danger">Sil</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      rowKey={(record) => record.id} // Kullanıcı ID'si benzersiz anahtar
      loading={loading}
      pagination={false} // Sayfalama eklemek isterseniz burada düzenleme yapabilirsiniz
    />
  );
};

export default AdminUserPage;
