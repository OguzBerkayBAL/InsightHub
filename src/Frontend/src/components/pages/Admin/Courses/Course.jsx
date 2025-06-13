import React, { useState, useEffect } from 'react';
import { Button, Popconfirm, Space, Table, message } from 'antd';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';

const apiUrl = "http://localhost:3000/subject";

const Course = () => {
  const [dataSource, setDataSource] = useState([]);
  const navigate = useNavigate(); 

  // Tüm dersleri getir
  const getAllCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDataSource(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      message.error("Dersler alınırken bir hata oluştu.");
    }
  };

  // Ders silme işlemi
  const deleteCourse = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${apiUrl}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success("Silme işlemi başarılı.");
      getAllCourses(); // Verileri tekrar çek
    } catch (error) {
      console.error("Error deleting course:", error);
      message.error("Silme işlemi sırasında bir hata oluştu.");
    }
  };

  useEffect(() => {
    getAllCourses();
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
      title: "Üniversite",
      dataIndex: "university",
      key: "university",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Ders Linki",
      dataIndex: "subjectLink",
      key: "subjectLink",
      render: (text) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      ),
    },
    {
      title: "Ülke",
      dataIndex: "country",
      key: "country",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Ders Yılı",
      dataIndex: "subjectYear",
      key: "subjectYear",
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
            onClick={() => navigate(`/admin/course/update/${record.id}`)}
          >
            Düzenle
          </Button>
          <Popconfirm
            title="Silmek istediğinize emin misiniz?"
            onConfirm={() => deleteCourse(record.id)} // Silme işlemi çağrılır
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
      scroll={{ x: 'max-content' }} // Yatay kaydırma
      columns={columns}
      dataSource={dataSource}
      rowKey={(record) => record.id} // ID alanını rowKey olarak kullanıyoruz
    />
  );
};

export default Course;
