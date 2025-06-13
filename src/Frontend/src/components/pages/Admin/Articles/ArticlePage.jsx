import React, { useState, useEffect } from 'react';
import { Button, Popconfirm, Space, Table, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const apiUrl = "http://localhost:3000/article";

const ArticlePage = () => {
  const [dataSource, setDataSource] = useState([]);
  const navigate = useNavigate();

  const getAllArticles = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDataSource(response.data.data);
    } catch (error) {
      console.error("Error fetching articles:", error);
      message.error("Makale alınırken bir hata oluştu.");
    }
  };

  const deleteArticle = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${apiUrl}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Silinen makaleyi dataSource listesinden çıkar
      setDataSource(dataSource.filter((item) => item.id !== id));
      message.success("Makale başarıyla silindi.");
    } catch (error) {
      console.error("Error deleting article:", error);
      message.error("Makale silinirken bir hata oluştu.");
    }
  };

  useEffect(() => {
    getAllArticles();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Başlık",
      dataIndex: "title",
      key: "title",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Kategori",
      dataIndex: "category",
      key: "category",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Yazar",
      dataIndex: "author",
      key: "author",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "DOI",
      dataIndex: "DOI",
      key: "DOI",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Arxiv Linki",
      dataIndex: "archiveLink",
      key: "archiveLink",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => <span>{new Date(text).toLocaleString()}</span>,
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (text) => <span>{new Date(text).toLocaleString()}</span>,
    },
    {
      title: "Yapabilecekleriniz",
      dataIndex: "actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            onClick={() => navigate(`/admin/article/update/${record.id}`)}
          >
            Düzenle
          </Button>
          <Popconfirm
            title="Silmek istediğinize emin misiniz?"
            onConfirm={() => deleteArticle(record.id)} // Silme işlemi burada
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
      scroll={{ x: 'max-content' }}
      columns={columns}
      dataSource={dataSource}
      rowKey={(record) => record.id}
    />
  );
};

export default ArticlePage;
