import React, { useState, useEffect } from "react";
import { Button, Form, Input, message, Spin } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const DatasetUpdate = () => {
  const { id } = useParams(); // URL'den id parametresini almak
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate(); // useNavigate hook'u ile yönlendirme işlemi
  const apiUrl = "http://localhost:3000/dataSet";
  const token = localStorage.getItem("token");

  // Dataset verilerini çekme
  const getDataset = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInitialValues(response.data); // Başlangıç verilerini al
      console.log("Dataset Data:", response.data); // Veriyi kontrol etmek için
    } catch (error) {
      console.error("Error fetching dataset:", error);
      setApiError("Dataset verisi alınırken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // Güncelleme işlemi
  const updateDataset = async (values) => {
    setLoading(true);
    try {
      const response = await axios.put(`${apiUrl}/${id}`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        message.success("Dataset başarıyla güncellendi!");
        navigate("/admin/datasets"); // Başarıyla güncellendikten sonra dataset sayfasına yönlendir
      } else {
        message.error(`Dataset güncellenirken bir hata oluştu!`);
        console.error("Error Details:", response.data);
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Dataset güncellenirken bir hata oluştu!");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = (values) => {
    console.log("Form Values:", values); // Formdan gelen verileri kontrol et
    updateDataset(values); // Güncelleme işlemi
  };

  useEffect(() => {
    getDataset(); // Bileşen yüklendiğinde dataset verisini al
  }, [id]);

  if (loading || !initialValues) {
    return <Spin spinning={loading}>Yükleniyor...</Spin>; // Yükleme durumu
  }

  return (
    <>
      {apiError && <div style={{ color: "red" }}>{apiError}</div>} {/* Hata mesajı */}
      <Form
        name="update-dataset"
        layout="vertical"
        onFinish={onFinish}
        initialValues={initialValues} // initialValues ile formu başlat
      >
        <Form.Item
          label="Dataset İsmi"
          name="datasetName"
          rules={[
            {
              required: true,
              message: "Lütfen dataset ismini girin!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Dataset Linki"
          name="datasetLink"
          rules={[
            {
              required: true,
              message: "Lütfen dataset linkini girin!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Dataset Açıklaması"
          name="datasetDescription"
          rules={[
            {
              required: true,
              message: "Lütfen dataset açıklamasını girin!",
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          label="Dataset Türü"
          name="datasetType"
          rules={[
            {
              required: true,
              message: "Lütfen dataset türünü girin!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Dataset Yılı"
          name="datasetYear"
          rules={[
            {
              required: true,
              message: "Lütfen dataset yılını girin!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Dataset Formatı"
          name="datasetFormat"
          rules={[
            {
              required: true,
              message: "Lütfen dataset formatını girin!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Dil"
          name="language"
          rules={[
            {
              required: true,
              message: "Lütfen dataset dilini girin!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Boyut"
          name="size"
          rules={[
            {
              required: true,
              message: "Lütfen dataset boyutunu girin!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Lisans"
          name="license"
          rules={[
            {
              required: true,
              message: "Lütfen dataset lisansını girin!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading}>
          Güncelle
        </Button>
      </Form>
    </>
  );
};

export default DatasetUpdate;
