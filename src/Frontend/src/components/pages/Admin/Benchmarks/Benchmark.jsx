import React, { useState, useEffect } from 'react';
import { Button, Popconfirm, Space, Table, message } from 'antd';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom'; 

const apiUrl = "http://localhost:3000/benchmark";

const BenchmarkPage = () => {
  const [dataSource, setDataSource] = useState([]);
  const navigate = useNavigate();

  // Benchmark'ları çekme fonksiyonu
  const getAllBenchMarks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDataSource(response.data);
    } catch (error) {
      console.error("Error fetching benchmarks:", error);
      message.error("Benchmark'lar alınırken bir hata oluştu.");
    }
  };

  // Benchmark silme fonksiyonu
  const deleteBenchmark = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${apiUrl}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Başarı durumunda tabloyu güncelle
      setDataSource(dataSource.filter((item) => item.id !== id));
      message.success("Benchmark başarıyla silindi.");
    } catch (error) {
      console.error("Error deleting benchmark:", error);
      message.error("Benchmark silinirken bir hata oluştu.");
    }
  };

  useEffect(() => {
    getAllBenchMarks();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "İsim",
      dataIndex: "benchmarkName",
      key: "benchmarkName",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Tür",
      dataIndex: "benchmarkType",
      key: "benchmarkType",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Açıklama",
      dataIndex: "benchmarkDescription",
      key: "benchmarkDescription",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Link",
      dataIndex: "benchmarkLink",
      key: "benchmarkLink",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Yıl",
      dataIndex: "benchmarkYear",
      key: "benchmarkYear",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Oluşturulma Tarihi",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => <span>{new Date(text).toLocaleString()}</span>,
    },
    {
      title: "Güncellenme Tarihi",
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
          {/* Düzenle butonunda yönlendirme işlemi */}
          <Button 
            type="primary" 
            onClick={() => navigate(`/admin/benchmark/update/${record.id}`)} 
          >
            Düzenle
          </Button>
          <Popconfirm
            title="Silmek istediğinize emin misiniz?"
            onConfirm={() => deleteBenchmark(record.id)} // Silme işlemi burada
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

export default BenchmarkPage;
